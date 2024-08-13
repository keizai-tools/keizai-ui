import { LogOut, UnlockKeyhole, User2 } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

function UserButton() {
	const { handleSignOut } = useAuthProvider();
	const navigate = useNavigate();

	function navigateChangePassword() {
		navigate('/change-password');
	}

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
					className="flex items-center gap-2 py-2 pr-8 cursor-pointer"
					onClick={navigateChangePassword}
				>
					<UnlockKeyhole className="w-4 h-4" />
					<span>Change password</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					data-test="user-dropdown-log-out"
					className="flex items-center gap-2 py-2 pr-8 mt-1 cursor-pointer"
					onClick={handleSignOut}
				>
					<LogOut className="w-4 h-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserButton;
