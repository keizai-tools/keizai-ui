import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import flagsmith from 'flagsmith';
import { FlagsmithProvider } from 'flagsmith/react';
import { Outlet } from 'react-router-dom';

import { TooltipProvider } from '../common/components/ui/tooltip';

import { Toaster } from '@/common/components/ui/toaster';
import { ThemeProvider } from '@/config/theme/context/themeProvider';
import { AuthProvider } from '@/modules/auth/context/AuthContext';

const queryClient = new QueryClient();

export default function Providers() {
	return (
		<FlagsmithProvider
			options={{
				environmentID:
					(import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_ID as string) ?? '',
			}}
			flagsmith={flagsmith}
		>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<AuthProvider>
					<QueryClientProvider client={queryClient}>
						<TooltipProvider>
							<Outlet />
							<Toaster />
						</TooltipProvider>
					</QueryClientProvider>
				</AuthProvider>
			</ThemeProvider>
		</FlagsmithProvider>
	);
}
