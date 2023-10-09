import { Outlet } from 'react-router-dom';

import Sidebar from '@/common/components/sidebar/Sidebar';
import Providers from '@/providers/Providers';

export default function Root() {
	return (
		<Providers>
			<main className="flex min-h-screen bg-background">
				<Sidebar />
				<Outlet />
			</main>
		</Providers>
	);
}
