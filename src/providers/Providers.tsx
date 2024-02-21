import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import flagsmith from 'flagsmith';
import { FlagsmithProvider } from 'flagsmith/react';
import React from 'react';

import { TooltipProvider } from '../common/components/ui/tooltip';
import { AuthProvider } from './AuthProvider';

import { Toaster } from '@/common/components/ui/toaster';
import { ThemeProvider } from '@/providers/ThemeProvider';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<FlagsmithProvider
			options={{
				environmentID: import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_ID || '',
			}}
			flagsmith={flagsmith}
		>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<AuthProvider>
					<QueryClientProvider client={queryClient}>
						<TooltipProvider>
							{children}
							<Toaster />
						</TooltipProvider>
					</QueryClientProvider>
				</AuthProvider>
			</ThemeProvider>
		</FlagsmithProvider>
	);
};

export default Providers;
