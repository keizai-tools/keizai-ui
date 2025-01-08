import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import flagsmith from 'flagsmith';
import { FlagsmithProvider } from 'flagsmith/react';
import { Outlet } from 'react-router-dom';

import { TooltipProvider } from '../common/components/ui/tooltip';

import { Toaster } from '@/common/components/ui/toaster';
import { EphemeralProvider } from '@/common/context/EphemeralContext';
import { ThemeProvider } from '@/config/theme/context/themeProvider';
import { AuthProvider } from '@/modules/auth/context/authContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

export default function Providers() {
  return (
    <FlagsmithProvider
      options={{
        environmentID:
          (import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_ID as string) ?? '',
      }}
      flagsmith={flagsmith}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <EphemeralProvider>
              <TooltipProvider>
                <Outlet />
                <Toaster />
              </TooltipProvider>
            </EphemeralProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </FlagsmithProvider>
  );
}
