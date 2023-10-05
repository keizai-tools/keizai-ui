import { Outlet } from 'react-router-dom';

import Sidebar from '@/common/components/sidebar/Sidebar';
import { TooltipProvider } from '@/common/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function Root() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<TooltipProvider>
				<main className="flex min-h-screen bg-background">
					<Sidebar />
					<div id="pages">
						<Outlet />
					</div>
				</main>
			</TooltipProvider>
		</ThemeProvider>
	);
}
