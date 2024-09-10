import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import InvocationByCollectionPage from '../invocation/InvocationByCollectionPage';

import Terminal from '@/common/components/ui/Terminal';
import { Button } from '@/common/components/ui/button';
import { Invocation } from '@/common/types/invocation';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';
import useInvocations from '@/modules/invocation/hooks/useInvocations';
import { InvocationService } from '@/modules/invocation/services/invocation.service';
import { EnvironmentProvider } from '@/providers/environmentProvider';

export default function InvocationByCollection() {
  const [invocations, setInvocations] = useState<Invocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { collectionId } = useParams<{ collectionId: string }>();
  const { wallet, connectWallet } = useAuthProvider();

  const [isTerminalVisible, setIsTerminalVisible] = useState(true);

  const { contractResponses, handleRunInvocation, isRunningInvocation } =
    useInvocations(invocations, wallet, connectWallet);

  function toggleTerminalVisibility(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'j') {
      event.preventDefault();
      setIsTerminalVisible((prev) => !prev);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', toggleTerminalVisibility);

    return () => {
      window.removeEventListener('keydown', toggleTerminalVisibility);
    };
  }, []);

  useEffect(() => {
    const fetchInvocations = async () => {
      if (!collectionId) return;

      try {
        const invocationService = new InvocationService(collectionId);
        const response: Invocation[] =
          await invocationService.getInvocationByCollectionId();
        setInvocations(response);
      } catch (err) {
        setError('Failed to fetch invocations');
      } finally {
        setLoading(false);
      }
    };

    fetchInvocations();
  }, [collectionId]);

  let content;

  if (loading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>{error}</p>;
  } else {
    content = (
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full gap-4">
          <h2
            className="text-xl font-bold text-slate-100"
            data-test="invocation-section-title"
          >
            Invocations
          </h2>
          <Button
            className="self-end px-4 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md w-fit hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={handleRunInvocation}
            disabled={isRunningInvocation}
          >
            {!isRunningInvocation ? (
              'Run All'
            ) : (
              <div className="flex items-center gap-2">
                <Loader className="w-auto font-bold animate-spin" size="16" />
                <p>Running</p>
              </div>
            )}
          </Button>
        </div>

        <div className="flex flex-col">
          {invocations?.map((invocation) => (
            <InvocationByCollectionPage
              key={invocation.id}
              invocation={invocation}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <EnvironmentProvider>
      <main className="flex flex-col w-full max-h-screen p-4 space-y-6 overflow-y-auto">
        {content}
        <div className="relative flex flex-col w-full h-full gap-2 overflow-hidden">
          {isTerminalVisible && (
            <div className="flex-grow p-10">
              <Terminal entries={contractResponses} />
            </div>
          )}
        </div>
        <Outlet />
      </main>
    </EnvironmentProvider>
  );
}
