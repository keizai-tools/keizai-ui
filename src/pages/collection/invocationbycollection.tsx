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
	const [executionMode, setExecutionMode] = useState<'parallel' | 'sequential'>(
		'parallel',
	);

	const {
		contractResponses,
		handleRunInvocationSequential,
		isRunningInvocation,
		handleRunInvocationParallel,
	} = useInvocations(invocations, wallet, connectWallet);

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

	const handleExecution = () => {
		if (executionMode === 'parallel') {
			handleRunInvocationParallel();
		} else {
			handleRunInvocationSequential();
		}
	};

	return (
		<EnvironmentProvider>
			<main className="flex flex-col space-y-6 max-h-screen overflow-y-auto p-4 w-full">
				{loading ? (
					<p>Loading...</p>
				) : error ? (
					<p>{error}</p>
				) : (
					<div className="flex flex-col space-y-6 w-full">
						<h2>Invocations</h2>
						<div className="flex items-center justify-end space-x-4">
							<select
								className="border rounded-md p-2  bg-blue-500"
								value={executionMode}
								onChange={(e) =>
									setExecutionMode(e.target.value as 'sequential' | 'parallel')
								}
							>
								<option value="parallel">Parallel</option>
								<option value="sequential">Sequential</option>
							</select>
							<Button
								className="w-auto px-3 py-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-blue-500 text-white rounded-md self-end"
								onClick={handleExecution}
								disabled={isRunningInvocation}
							>
								{!isRunningInvocation ? (
									executionMode === 'sequential' ? (
										'Run All Sequential'
									) : (
										'Run All Parallel'
									)
								) : (
									<div className="flex items-center gap-2">
										<Loader
											className="w-auto font-bold animate-spin"
											size="16"
										/>
										<p>Running</p>
									</div>
								)}
							</Button>
						</div>
						<div className="flex flex-col ">
							{invocations?.map((invocation) => (
								<InvocationByCollectionPage
									key={invocation.id}
									invocation={invocation}
								/>
							))}
						</div>
					</div>
				)}
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
