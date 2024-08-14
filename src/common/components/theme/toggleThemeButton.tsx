import { Button } from '@common/components/ui/button';
import { Moon, Sun } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { useTheme } from '@/config/theme/hooks/useTheme';

enum Theme {
	LIGHT = 'light',
	DARK = 'dark',
	SYSTEM = 'system',
}

export function ToggleThemeButton() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu data-test="theme-container">
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" data-test="theme-dropdown-btn">
					<Sun
						className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						data-test="theme-dropdown-img-sun"
					/>
					<Moon
						className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						data-test="theme-dropdown-img-moon"
					/>
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" data-test="theme-dropdown-container">
				<DropdownMenuItem
					onClick={() => setTheme(Theme.LIGHT)}
					data-test="theme-dropdown-light"
				>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme(Theme.DARK)}
					data-test="theme-dropdown-dark"
				>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme(Theme.SYSTEM)}
					data-test="theme-dropdown-system"
				>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
