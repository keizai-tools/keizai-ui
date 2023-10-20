import { Outlet } from 'react-router-dom';

import Folders from '@/common/components/Folders/Folders';

const CollectionPage = () => {
	return (
		<main className="flex flex-1" data-test="collection-page-container">
			<Folders />
			<Outlet />
		</main>
	);
};

export default CollectionPage;
