import { Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

function StartOverlayLoading() {
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const stages = [
      'Initializing the environment...',
      'Provisioning the container on Fargate...',
      'Checking if Friend Bot is working...',
      'Checking if Cores are operational...',
      'Checking other internal features...',
      'Finalizing the configuration...',
    ];

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
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-[100000] backdrop-blur-sm"
      style={{
        backgroundColor: `hsla(222.2, 84%, 4.9%, 0.8)`,
        pointerEvents: 'none',
      }}
    >
      <Loader className="mb-4 animate-spin" size="36" />
      <p className="text-lg text-center text-white">{statusMessage}</p>
    </div>
  );
}

export default StartOverlayLoading;
