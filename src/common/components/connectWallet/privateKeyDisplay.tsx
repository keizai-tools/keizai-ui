import { Copy } from 'lucide-react';

import { useToast } from '../ui/use-toast';

interface PrivateKeyDisplayProps {
  privateKey: string;
}

export function PrivateKeyDisplay({
  privateKey,
}: Readonly<PrivateKeyDisplayProps>) {
  const { toast } = useToast();

  function copyPrivateKey() {
    navigator.clipboard.writeText(privateKey);
    toast({
      title: 'Private Key Copied',
      description: 'The private key has been copied to your clipboard',
    });
  }

  return (
    <div className="flex items-center w-full gap-4 p-4 border-2 border-solid rounded-lg bg-slate-950 border-offset-background">
      <p className="h-full text-center pointer-events-none whitespace-nowrap w-min text-slate-600">
        Private Key
      </p>
      <p className="w-full h-full overflow-hidden font-light text-center whitespace-nowrap">
        {privateKey}
      </p>
      <Copy
        className="h-full transition-all duration-300 ease-in-out transform cursor-pointer hover:text-primary hover:scale-110"
        onClick={copyPrivateKey}
      />
    </div>
  );
}
