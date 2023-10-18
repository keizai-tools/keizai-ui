import { LogOut } from 'lucide-react';

import { Button } from '../ui/button';

import { useAuth } from '@/services/auth/hook/useAuth';

function ButtonLogOut() {
	const { signOut } = useAuth();

	return (
		<Button
			variant="outline"
			size="icon"
			data-test="sidebar-btn-logout"
			onClick={signOut}
		>
			<LogOut className="h-[1.2rem] w-[1.2rem]" />
		</Button>
	);
}

export default ButtonLogOut;
