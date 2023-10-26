import { Checkbox } from '@radix-ui/react-checkbox';
import { Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../../ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog';

import { IKeypair } from '@/services/soroban/domain/keypair';
import useSoroban from '@/services/soroban/hook/useStellar';

const INITIAL_STATE: IKeypair = {
	publicKey: '',
	secretKey: '',
};

function CreateNewAccount() {
	const [account, setAccount] = useState<IKeypair>(INITIAL_STATE);
	const [isKeypairStored, setIsKeypairStored] = useState<boolean>(false);
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const { createNewAccount } = useSoroban();

	const textToCopy = `Public key:
  ${account.publicKey}
Secret key:
  ${account.secretKey}
  `;

	const toggleStoredKeypair = () => {
		setIsKeypairStored(!isKeypairStored);
	};

	const copyToClipboard = (textToCopy: string) => {
		const displayTimeOfTooltip = 2000;
		navigator.clipboard.writeText(textToCopy).then(
			() => {
				setIsCopied(true);
				setTimeout(() => {
					setIsCopied(false);
				}, displayTimeOfTooltip);
			},
			(err) => {
				throw new Error(`failed to copy, ${err.message}`);
			},
		);
	};

	const onCreateAccount = () => {
		const keypair = createNewAccount();
		setAccount(keypair);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className="font-bold px-10 border-[3px] border-primary text-primary h-full hover:text-background hover:bg-primary"
					variant="outline"
					data-test="auth-soroban-create-account-btn"
					onClick={onCreateAccount}
				>
					Generate new account
				</Button>
			</DialogTrigger>
			<DialogContent data-test="auth-soroban-create-account-container">
				<DialogHeader>
					<DialogTitle
						className="mb-2"
						data-test="auth-soroban-create-account-title"
					>
						Generate a new keypair
					</DialogTitle>
					<DialogDescription>
						<div
							className="border border-destructive bg-destructive/25 rounded-sm p-2 text-md font-semibold"
							data-test="auth-soroban-create-account-description"
						>
							<h1 className="text-base">ATTENTION:</h1>
							<ul className="ml-4">
								<li>
									{'- '}
									It is very important to save your secret key and store it
									somewhere safe.
								</li>
								<li>
									{'- '}If you lose it, you will lose access to your account.
								</li>
							</ul>
						</div>
						<div className="mt-4">
							<div
								className="mb-4"
								data-test="auth-soroban-create-account-keys-container"
							>
								<div
									className="mb-6"
									data-test="auth-soroban-create-account-public-container"
								>
									<h4 className="text-sm font-medium mb-2">PUBLIC KEY</h4>
									<code className="break-words bg-stellar-bg-secondary text-sm border border-solid border-stellar-border-primary rounded-sm px-1 py-0.5">
										{account.publicKey}
									</code>
								</div>
								<div
									className="mb-6"
									data-test="auth-soroban-create-account-secret-container"
								>
									<h4 className="text-sm font-medium mb-2">SECRET KEY</h4>
									<code className="break-words bg-stellar-bg-secondary text-sm border border-solid border-stellar-border-primary rounded-sm px-1 py-0.5">
										{account.secretKey}
									</code>
								</div>
							</div>

							<div
								className="flex gap-2 flex-row"
								data-test="auth-soroban-create-account-copy-text-container"
							>
								<button
									className="inline-flex gap-1.5 items-center text-stellar-link hover:text-stellar-link-hover"
									data-test="auth-soroban-create-account-btn-copy-keys"
									onClick={() => copyToClipboard(textToCopy)}
								>
									<span className="text-sm font-semibold text-primary">
										Copy keys
									</span>
									<Copy className="w-5 h-5 text-primary" />
								</button>
								{isCopied && (
									<p
										data-test="auth-soroban-create-account-tooltip-copied"
										className="ml-3 text-primary whitespace-nowrap rounded border border-primary py-[6px] px-4 text-sm font-semibold"
									>
										Copied
									</p>
								)}
							</div>
						</div>
						<div
							className="flex items-center space-x-2 pt-4"
							data-test="auth-soroban-create-account-stored-container"
						>
							<Checkbox
								onCheckedChange={toggleStoredKeypair}
								id="secret-key-accept"
								className={`relative h-5 w-5 cursor-pointer rounded-md border border-primary ${
									isKeypairStored ? 'bg-primary' : ''
								}`}
							/>
							<label htmlFor="secret-key-accept">
								I've stored my secret key in a safe place
							</label>
						</div>
					</DialogDescription>
				</DialogHeader>
				<DialogClose asChild>
					<Button
						type="button"
						size="sm"
						className="px-3"
						data-test="auth-soroban-create-account-btn-submit"
						disabled={!isKeypairStored}
						onClick={toggleStoredKeypair}
					>
						Close
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}

export default CreateNewAccount;
