import { Outlet } from 'react-router-dom';

import { AppLoader } from '@/common/components/Loader/AppLoader';
import Sidebar from '@/common/components/sidebar/Sidebar';

export default function Root() {
	return (
		<main className="flex min-h-screen bg-background">
			<Sidebar />
			<AppLoader>
				<Outlet />
			</AppLoader>
		</main>
	);
}
