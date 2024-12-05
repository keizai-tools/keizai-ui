import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { InvocationService } from '../services/invocation.service';
import {
  getInvocationResponse,
  handleAxiosError,
} from '../utils/invocation.utils';

import { TerminalEntry } from '@/common/components/ui/Terminal';
import { Invocation, InvocationResponse } from '@/common/types/invocation';
import { NETWORK } from '@/common/types/soroban.enum';
import { IApiResponse } from '@/config/axios/interfaces/IApiResponse';
import { IApiResponseError } from '@/config/axios/interfaces/IApiResponseError';
import { apiService } from '@/config/axios/services/api.service';
import { IWallet } from '@/modules/auth/interfaces/IAuthenticationContext';
import signTransaction from '@/modules/signer/functions/signTransaction';

function useInvocations(
  invocations: Invocation[],
  wallet: IWallet,
  connectWallet: (network: Partial<NETWORK>) => Promise<void>,
) {
  const [contractResponses, setContractResponses] = useState<TerminalEntry[]>(
    [],
  );
  const [isRunningInvocation, setIsRunningInvocation] = useState(false);
  const { collectionId } = useParams();

  const invocationService = useMemo(
    () => new InvocationService(collectionId ?? ''),
    [collectionId],
  );

  const runKeizaiService = useCallback(
    async (serviceToRun: string, invocation?: string) => {
      if (invocation) invocationService.invocationResponse = invocation;
      const contextFunction = new Function(
        'Keizai',
        `return (async () => { ${serviceToRun} })();`,
      ).bind(null, invocationService);
      return contextFunction();
    },
    [invocationService],
  );

  const handleRunService = useCallback(
    async (title: string, serviceToRun: string, invocation?: string) => {
      try {
        return {
          isError: false,
          message: String(serviceToRun),
          title,
          invocationId: invocation,
          serviceResponse: await runKeizaiService(serviceToRun, invocation),
        };
      } catch (error) {
        return {
          isError: true,
          message: String(`${error} from Pre-invocation script`),
          title: `${title} Error`,
          serviceToRun: String(serviceToRun),
          invocationId: invocation,
        };
      }
    },
    [runKeizaiService],
  );

  const prepareInvocation = async (id?: string) => {
    const res = await apiService?.get<IApiResponse<string>>(
      `/invocation/${id}/prepare`,
    );
    return res.payload;
  };

  const runInvocation = async (
    id?: string,
    signedTransactionXDR?: string | null,
  ) => {
    const res = await apiService?.post<IApiResponse<InvocationResponse>>(
      `/invocation/${id}/run`,
      {
        signedTransactionXDR: signedTransactionXDR ?? '',
      },
    );
    return res.payload;
  };

  const handleRunInvocationSequential = useCallback(async () => {
    if (isRunningInvocation) return;
    setIsRunningInvocation(true);

    for (const invocation of invocations) {
      try {
        if (
          invocation.network === NETWORK.SOROBAN_MAINNET &&
          !wallet[NETWORK.SOROBAN_MAINNET]
        ) {
          await connectWallet(NETWORK.SOROBAN_MAINNET);
        }

        let signedTransaction: string | null = null;
        if (!wallet[invocation.network as keyof typeof wallet]?.autoGenerated) {
          const invocationTransactionXDR = await prepareInvocation(
            invocation.id,
          );
          signedTransaction = await signTransaction(
            invocationTransactionXDR,
            invocation.network as unknown as NETWORK,
          );
        }

        const preInvocationResponse = await handleRunService(
          'Pre-Invocation',
          invocation.preInvocation ?? '',
          invocation.id,
        );

        const response = await runInvocation(invocation.id, signedTransaction);

        const postInvocationResponse = await handleRunService(
          'Post-Invocation',
          invocation.postInvocation ?? '',
          response?.response,
        );

        const invocationResponse = getInvocationResponse(
          response,
          preInvocationResponse?.serviceResponse,
          postInvocationResponse?.serviceResponse,
        );

        setContractResponses((prev) => [
          ...prev,
          {
            contractId: invocation.contractId,
            ...invocationResponse,
            invocationId: invocation.id,
          },
        ]);
      } catch (error) {
        const errorResponse = handleAxiosError(error as IApiResponseError);
        setContractResponses((prev) => [
          ...prev,
          {
            contractId: invocation.contractId,
            ...errorResponse,
            invocationId: invocation.id,
          },
        ]);
      }
    }

    setIsRunningInvocation(false);
  }, [
    invocations,
    isRunningInvocation,
    handleRunService,
    connectWallet,
    wallet,
  ]);

  const handleRunInvocationParallel = useCallback(async () => {
    if (isRunningInvocation) return;
    setIsRunningInvocation(true);

    try {
      const results: TerminalEntry[] = [];
      for (const invocation of invocations) {
        try {
          if (
            invocation.network === NETWORK.SOROBAN_MAINNET &&
            !wallet[NETWORK.SOROBAN_MAINNET]
          ) {
            await connectWallet(NETWORK.SOROBAN_MAINNET);
          }

          let signedTransaction = null;
          if (!wallet[invocation.network]?.autoGenerated) {
            const invocationTransactionXDR = await prepareInvocation(
              invocation.id,
            );
            signedTransaction = await signTransaction(
              invocationTransactionXDR,
              invocation.network as unknown as NETWORK,
            );
          }

          const preInvocationResponse = await handleRunService(
            'Pre-Invocation',
            invocation.preInvocation ?? '',
            invocation.id,
          );

          const response = await runInvocation(
            invocation.id,
            signedTransaction,
          );

          const postInvocationResponse = await handleRunService(
            'Post-Invocation',
            invocation.postInvocation ?? '',
            response?.response,
          );

          const invocationResponse = getInvocationResponse(
            response,
            preInvocationResponse?.serviceResponse,
            postInvocationResponse?.serviceResponse,
          );

          results.push({ ...invocationResponse, invocationId: invocation.id });
        } catch (error) {
          const errorResponse = handleAxiosError(error);
          results.push({ ...errorResponse });
        }
      }
      setContractResponses((prev) => [...prev, ...results]);
    } catch (error) {
      console.error('Error running invocations in parallel:', error);
    } finally {
      setIsRunningInvocation(false);
    }
  }, [
    invocations,
    isRunningInvocation,
    handleRunService,
    connectWallet,
    wallet,
  ]);

  const clearContractResponses = () => {
    setContractResponses([]);
  };

  return {
    contractResponses,
    handleRunInvocationSequential,
    isRunningInvocation,
    handleRunInvocationParallel,
    clearContractResponses,
  };
}

export default useInvocations;
