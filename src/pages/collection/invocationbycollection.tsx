import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import InvocationByCollectionPage from '../invocation/InvocationByCollectionPage';

import { InvocationService } from '@/modules/invocation/services/invocation.service';
import { EnvironmentProvider } from '@/providers/environmentProvider';

export default function InvocationByCollection() {
	const [invocations, setInvocations] = useState<unknown[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const { collectionId } = useParams<{ collectionId: string }>();

	useEffect(() => {
		const fetchInvocations = async () => {
			if (!collectionId) return;

			try {
				const invocationService = new InvocationService(collectionId);
				const response: any =
					await invocationService.getInvocationByCollectionId();

				setInvocations(response?.folders[0]?.invocations);
			} catch (err) {
				setError('Failed to fetch invocations');
			} finally {
				setLoading(false);
			}
		};

		fetchInvocations();
	}, [collectionId]);

	return (
		<EnvironmentProvider>
			<main
				data-test="collection-page-container"
				className="flex flex-col space-y-6 max-h-screen overflow-y-auto p-4 w-full"
			>
				{loading ? (
					<p>Loading...</p>
				) : error ? (
					<p>{error}</p>
				) : (
					<div className="flex flex-col space-y-6 w-full">
						<h2>Invocations</h2>
						<div className="flex flex-col ">
							{invocations?.map((invocation: any) => (
								<InvocationByCollectionPage
									key={invocation.id}
									invocation={invocation}
								/>
							))}
						</div>
					</div>
				)}
				<Outlet />
			</main>
		</EnvironmentProvider>
	);
}
