import { Loader } from 'lucide-react';

function OverlayLoading() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{
        backgroundColor: `hsla(222.2, 84%, 4.9%, 0.8)`,
      }}
    >
      <Loader className="animate-spin" size="36" />
    </div>
  );
}

export default OverlayLoading;
