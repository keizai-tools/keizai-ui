import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { TooltipProvider } from '../common/components/ui/tooltip';

import { CollectionsProvider } from '@/providers/CollectionsProvider';
import { InvocationProvider } from '@/providers/InvocationProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<TooltipProvider>
					<CollectionsProvider>
						<InvocationProvider>{children}</InvocationProvider>
					</CollectionsProvider>
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export default Providers;
