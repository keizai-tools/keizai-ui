import { Loader } from 'lucide-react';

function FullscreenLoading() {
  return (
    <div
      className="z-50 flex items-center justify-center w-screen h-screen bg-background"
      style={{
        backgroundColor: `hsla(222.2, 84%, 4.9%, 0.8)`,
      }}
    >
      <Loader className="animate-spin" size="36" />
    </div>
  );
}

export default FullscreenLoading;
