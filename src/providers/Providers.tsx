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
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<TooltipProvider>
						<CollectionsProvider>
							<InvocationProvider>
								{children}
								<Toaster />
							</InvocationProvider>
						</CollectionsProvider>
					</TooltipProvider>
				</QueryClientProvider>
			</AuthProvider>
		</ThemeProvider>
	);
};

export default Providers;
