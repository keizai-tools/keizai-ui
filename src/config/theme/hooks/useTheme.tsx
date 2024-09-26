import { useContext } from 'react';

import { ThemeProviderContext } from '../context/themeProvider';
import { ThemeProviderState } from '../interfaces/theme.interface';

export function useTheme(): ThemeProviderState {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
}
