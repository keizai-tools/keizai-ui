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

  const navigateChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          asChild
          data-test="sidebar-btn-user"
          tooltip="User Configuration"
        >
          <User2 className="p-2 transition-colors duration-300 cursor-pointer hover:text-primary" />
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
          <UnlockKeyhole
            className={`text-gray-400 transition-colors duration-300 cursor-pointer hover:text-primary active:text-primary`}
          />
          <span>Change password</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          data-test="user-dropdown-log-out"
          className="flex items-center gap-2 py-2 pr-8 mt-1 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut
            className={`text-gray-400 transition-colors duration-300 cursor-pointer hover:text-primary active:text-primary`}
          />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
