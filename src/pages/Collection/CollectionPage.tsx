import { Outlet } from 'react-router-dom';

import Folders from '@/common/components/Folders/Folders';
import { EnvironmentProvider } from '@/providers/environmentProvider';

const CollectionPage = () => {
	return (
		<EnvironmentProvider>
			<main className="flex flex-1" data-test="collection-page-container">
				<Folders />
				<Outlet />
			</main>
		</EnvironmentProvider>
	);
};

export default CollectionPage;
