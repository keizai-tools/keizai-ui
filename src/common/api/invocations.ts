import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';

import { useToast } from '../components/ui/use-toast';
import { Invocation, InvocationResponse } from '../types/invocation';
import { NETWORK } from '../types/soroban.enum';

import { IApiResponse } from '@/config/axios/interfaces/IApiResponse';
import { apiService } from '@/config/axios/services/api.service';

export function useInvocationQuery({ id }: { id?: string }) {
  const query = useQuery<Invocation>({
    queryKey: ['invocation', id],
    queryFn: async () =>
      apiService
        ?.get<IApiResponse<Invocation>>(`/invocation/${id}`)
        .then((response) => response.payload),
    enabled: !!id,
  });

  return query;
}

export function useRunInvocationQuery({ id }: { id?: string }) {
  return async (signedTransactionXDR: string | null) => {
    const response = await apiService?.post<IApiResponse<InvocationResponse>>(
      `/invocation/${id}/run`,
      {
        signedTransactionXDR: signedTransactionXDR ?? '',
      },
    );
    return response.payload;
  };
}

export function usePrepareInvocationQuery({ id }: { id?: string }) {
  return async () => {
    const response = await apiService?.get<
      IApiResponse<
        | string
        | {
            status: number;
            message: string;
            name: string;
            response: string;
          }
      >
    >(`/invocation/${id}/prepare`);
    return response.payload;
  };
}

export function useCreateInvocationMutation() {
  const params = useParams();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      name,
      folderId,
      collectionId,
    }: {
      name: string;
      folderId?: string;
      collectionId?: string;
    }) =>
      apiService
        ?.post<IApiResponse<Invocation>>('/invocation', {
          name,
          folderId: folderId,
          collectionId: collectionId,
        })
        .then((response) => response.payload),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['collection', params.collectionId, 'folders'],
      });
      queryClient.invalidateQueries({
        queryKey: ['collection', params.collectionId, 'invocation'],
      });
    },
  });

  return mutation;
}

export function useInvocationsByCollectionIdQuery({ id }: { id?: string }) {
  return useQuery<Invocation[]>({
    queryKey: ['collection', id, 'invocation'],
    queryFn: async () =>
      apiService
        ?.get<IApiResponse<Invocation[]>>(`/collection/${id}/invocation`)
        .then((response) => response.payload),
    enabled: !!id,
  });
}

export function useEditInvocationMutation() {
  const params = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      name,
      folderId,
      contractId,
      selectedMethodId,
    }: {
      id: string;
      name?: string;
      folderId?: string;
      contractId?: string;
      selectedMethodId?: string;
    }) =>
      apiService
        ?.patch<IApiResponse<Invocation>>('/invocation', {
          id,
          name,
          folderId,
          contractId,
          selectedMethodId,
        })
        .then((response) => {
          return response.payload;
        })
        .catch(() => {
          toast({
            title: 'Something went wrong!',
            description: 'There was an error while editing this invocation.',
            variant: 'destructive',
          });
          if (contractId && window.umami)
            window.umami.track('Error loading contract', { contractId });
        }),
    onSuccess: (data, { name, id }) => {
      if (data) {
        if (name) {
          queryClient.invalidateQueries({
            queryKey: ['collection', params.collectionId, 'folders'],
          });
        } else {
          queryClient.invalidateQueries({ queryKey: ['invocation', id] });
        }
      }
    },
  });

  return mutation;
}

export function useEditSelectedMethodMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      selectedMethodId,
    }: {
      id: string;
      selectedMethodId?: string;
    }) =>
      apiService
        ?.patch<IApiResponse<Invocation>>('/invocation', {
          id,
          selectedMethodId,
        })
        .then((response) => response.payload),
    onMutate: async ({ id, selectedMethodId }) => {
      await queryClient.cancelQueries({ queryKey: ['invocation', id] });

      const previousInvocation = queryClient.getQueryData<Invocation>([
        'invocation',
        id,
      ]);

      queryClient.setQueryData(['invocation', id], {
        ...previousInvocation,
        selectedMethod: {
          id: selectedMethodId,
        },
      });

      return {
        previousInvocation,
      };
    },
  });

  return mutation;
}

export function useDeleteInvocationMutation() {
  const params = useParams();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) =>
      apiService
        ?.delete<IApiResponse<boolean>>(`/invocation/${id}`)
        .then((response) => response.payload),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['collection', params.collectionId, 'folders'],
      });
      queryClient.invalidateQueries({
        queryKey: ['collection', params.collectionId, 'invocation'],
      });
    },
  });

  return mutation;
}

export function useEditNetworkMutation(showToast: boolean) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async ({ network, id }: { network: string; id: string }) =>
      apiService
        ?.patch<IApiResponse<Invocation>>(`/invocation`, {
          network,
          id,
        })
        .then((response) => response.payload),

    onMutate: ({ network, id }) => {
      const previousInvocation = queryClient.getQueryData<Invocation>([
        'invocation',
        id,
      ]);

      queryClient.setQueryData(['invocation', id], {
        ...previousInvocation,
        network,
      });

      return {
        previousInvocation,
      };
    },
    onError: () => {
      toast({
        title: 'Something went wrong!',
        description: "Couldn't change network, please try again",
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      if (data) queryClient.setQueryData(['invocation', data.id], data);
      if (showToast) {
        toast({
          title: 'Successfully!',
          description: 'Network has been changed',
        });
      }
    },
  });
  return mutation;
}

export function useEditInvocationKeysMutation() {
  const queryClient = useQueryClient();
  const lastParamsRef = useRef<{
    id: string;
    contractId?: string;
    secretKey?: string;
    publicKey?: string;
    network?: NETWORK;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      id,
      contractId,
      secretKey,
      publicKey,
      network,
    }: {
      id: string;
      contractId?: string;
      secretKey?: string;
      publicKey?: string;
      network?: NETWORK;
    }) => {
      if (
        lastParamsRef.current &&
        lastParamsRef.current.id === id &&
        lastParamsRef.current.contractId === contractId &&
        lastParamsRef.current.secretKey === secretKey &&
        lastParamsRef.current.publicKey === publicKey &&
        lastParamsRef.current.network === network
      ) {
        return;
      }

      lastParamsRef.current = { id, contractId, secretKey, publicKey, network };

      return apiService
        ?.patch<IApiResponse<Invocation>>('/invocation', {
          id,
          secretKey,
          publicKey,
          network,
          contractId,
        })
        .then((response) => response.payload);
    },
    onSuccess: (data) => {
      if (data) queryClient.setQueryData(['invocation', data.id], data);
    },
  });

  return mutation;
}

export function useEditPreInvocationMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      id,
      preInvocation,
      postInvocation,
    }: {
      id: string;
      preInvocation?: string;
      postInvocation?: string;
    }) => {
      apiService
        ?.patch<IApiResponse<Invocation>>('/invocation', {
          id,
          preInvocation,
          postInvocation,
        })
        .then((response) => response.payload);
    },
    onSuccess(_, variables) {
      const oldData = queryClient.getQueryData<Invocation>([
        'invocation',
        variables.id,
      ]);
      queryClient.setQueryData(['invocation', variables.id], {
        ...oldData,
        preInvocation: variables.preInvocation ?? oldData?.preInvocation,
        postInvocation: variables.postInvocation ?? oldData?.postInvocation,
      });
    },
  });
  return mutation;
}

export function useUploadWasmMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      formData,
      id,
    }: {
      formData: FormData;
      id: string;
    }) => {
      return await apiService
        ?.post<IApiResponse<string>>(`invocation/${id}/upload/wasm`, formData)
        .then((response) => response.payload);
    },
    onSuccess: (data, { id }) => {
      if (typeof data !== 'string') {
        throw new Error(data);
      }
      const newContractId = id;
      queryClient.invalidateQueries({ queryKey: ['invocation'] });
      return newContractId;
    },
  });
  return mutation;
}

export function usePrepareUploadWasmMutation() {
  const mutation = useMutation({
    mutationFn: async ({
      formData,
      id,
    }: {
      formData?: FormData;
      id?: string;
    }) => {
      return await apiService?.post<IApiResponse<string>>(
        `invocation/${id}/upload/prepare`,
        formData,
      );
    },
  });

  return mutation;
}

export function useRunUploadWasmMutation() {
  const mutation = useMutation({
    mutationFn: async ({
      id,
      signedTransactionXDR,
      deploy = false,
    }: {
      id: string;
      signedTransactionXDR: string;
      deploy: boolean;
    }) => {
      const response = await apiService?.post<
        IApiResponse<
          string | { status: string; title: string; response: string }
        >
      >(`invocation/${id}/upload/run`, {
        signedTransactionXDR,
        deploy,
      });

      return response.payload;
    },
  });
  return mutation;
}

export function useEditContractIdMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      contractId,
    }: {
      id: string;
      contractId: string;
    }) =>
      apiService
        ?.patch<IApiResponse<Invocation>>('/invocation', {
          id,
          contractId,
        })
        .then((response) => response.payload),
    onSuccess: (_, { id, contractId }) => {
      queryClient.invalidateQueries({ queryKey: ['invocation', id] });
      queryClient.invalidateQueries({ queryKey: ['invocation', contractId] });
    },
  });

  return mutation;
}
