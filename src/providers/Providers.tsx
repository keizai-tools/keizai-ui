import React from 'react';

import { TooltipProvider } from '../common/components/ui/tooltip';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { CollectionsProvider } from '@/providers/CollectionsProvider';
import { InvocationProvider } from '@/providers/InvocationProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<TooltipProvider>
				<CollectionsProvider>
					<InvocationProvider>{children}</InvocationProvider>
				</CollectionsProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
};

export default Providers;
