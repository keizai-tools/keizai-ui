import { LogOut, UnlockKeyhole, User2 } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { useAuth } from '@/services/auth/hook/useAuth';

function SettingButton() {
	const { signOut } = useAuth();
	const navigate = useNavigate();

	const navigateChangePassword = () => {
		navigate('/change-password');
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" data-test="sidebar-btn-user">
					<User2 className="h-[1.2rem] w-[1.2rem]" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side="right"
				align="end"
				data-test="user-dropdown-container"
			>
				<DropdownMenuItem
					data-test="user-dropdown-change-password"
					className="flex items-center gap-2 cursor-pointer pr-8 py-2"
					onClick={navigateChangePassword}
				>
					<UnlockKeyhole className="h-4 w-4" />
					<span>Change password</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					data-test="user-dropdown-log-out"
					className="flex items-center gap-2 cursor-pointer pr-8 py-2 mt-1"
					onClick={signOut}
				>
					<LogOut className="h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default SettingButton;
