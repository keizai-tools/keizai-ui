import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { TooltipProvider } from '../common/components/ui/tooltip';
import { AuthProvider } from './AuthProvider';

import { Toaster } from '@/common/components/ui/toaster';
import { CollectionsProvider } from '@/providers/CollectionsProvider';
import { InvocationProvider } from '@/providers/InvocationProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
					<TooltipProvider>
						<CollectionsProvider>
							<InvocationProvider>
								{children}
								<Toaster />
							</InvocationProvider>
						</CollectionsProvider>
					</TooltipProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</AuthProvider>
	);
};

export default Providers;
