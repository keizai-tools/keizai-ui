import { Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

interface OverlayLoadingProps {
  type?: 'wallet' | 'start' | 'stop' | 'upload';
}

const stagesMap = {
  wallet: [
    'Creating the account for the ephemeral environment...',
    'Funding the account for usage...',
    'Finalizing the configuration...',
  ],
  start: [
    'Initializing the environment...',
    'Provisioning the container on Fargate...',
    'Checking if Friend Bot is working...',
    'Checking if Cores are operational...',
    'Checking other internal features...',
    'Finalizing the configuration...',
  ],
  stop: [
    'Stopping all running services...',
    'Releasing allocated resources...',
    'Updating system status...',
    'Closing all active connections...',
    'Terminating the environment and cleaning up...',
  ],
  upload: [
    'Uploading the WASM file...',
    'Validating the file...',
    'Deploying the contract...',
    'Finalizing the deployment...',
  ],
};

function OverlayLoading({ type }: OverlayLoadingProps) {
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!type) {
      setStatusMessage('Loading...');
      return;
    }

    const stages = stagesMap[type];
    let currentStage = 0;

    setStatusMessage(stages[currentStage]);
    currentStage++;

    const interval = setInterval(() => {
      setStatusMessage(stages[currentStage]);
      currentStage++;

      if (currentStage >= stages.length) {
        clearInterval(interval);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [type]);

  return (
    <div
      className="fixed w-full h-full inset-0 flex flex-col items-center justify-center z-[100000] backdrop-blur-sm pointer-events-auto"
      style={{
        backgroundColor: `hsla(222.2, 84%, 4.9%, 0.8)`,
        pointerEvents: 'none',
      }}
    >
      <Loader className="mb-4 animate-spin" size="48" />
      <p className="text-2xl text-white center text-">{statusMessage}</p>
      {type === 'start' && (
        <p className="text-lg text-center text-slate-400">
          This process takes approximately 3 minutes, please be patient.
        </p>
      )}
      {type === 'stop' && (
        <p className="text-lg text-center text-slate-400">
          This process takes approximately 1 minute, please be patient.
        </p>
      )}
    </div>
  );
}

export default OverlayLoading;
