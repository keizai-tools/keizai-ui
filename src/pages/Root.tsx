import { Outlet } from 'react-router-dom';

import { AppLoader } from '@/common/components/Loader/AppLoader';
import Sidebar from '@/common/components/sidebar/Sidebar';
import Providers from '@/providers/Providers';

export default function Root() {
	return (
		<Providers>
			<main className="flex min-h-screen bg-background">
				<Sidebar />
				<AppLoader>
					<Outlet />
				</AppLoader>
			</main>
		</Providers>
	);
}
