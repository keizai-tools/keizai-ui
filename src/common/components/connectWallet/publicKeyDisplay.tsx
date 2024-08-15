import { Copy } from 'lucide-react';

import { useToast } from '../ui/use-toast';

interface PublicKeyDisplayProps {
	publicKey: string;
}

export function PublicKeyDisplay({
	publicKey,
}: Readonly<PublicKeyDisplayProps>) {
	const { toast } = useToast();

	function copyPublicKey() {
		navigator.clipboard.writeText(publicKey);
		toast({
			title: 'Public Key Copied',
			description: 'The public key has been copied to your clipboard',
		});
	}

	return (
		<div className="flex items-center w-full gap-4 p-4 border-2 border-solid rounded-lg bg-slate-950 border-offset-background">
			<p className="h-full text-center pointer-events-none whitespace-nowrap w-min text-slate-600">
				Public Key
			</p>
			<p className="w-full h-full overflow-hidden font-light text-center whitespace-nowrap">
				{publicKey}
			</p>
			<Copy
				className="h-full transition-all duration-300 ease-in-out transform cursor-pointer hover:text-primary hover:scale-110"
				onClick={copyPublicKey}
			/>
		</div>
	);
}
