import { Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

function StopOverlayLoading() {
  const opacity = 0.2;
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const stages = [
      'Stopping services...',
      'Releasing resources...',
      'Updating status...',
      'Closing connections...',
      'Terminating the environment...',
    ];

    let currentStage = 0;

    setStatusMessage(stages[currentStage]);
    currentStage++;
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
      style={{
        backgroundColor: `hsla(222.2, 84%, 4.9%, ${opacity})`,
      }}
    >
      <Loader className="animate-spin mb-4" size="36" />
      <p className="text-white text-center">{statusMessage}</p>
    </div>
  );
}

export default StopOverlayLoading;
