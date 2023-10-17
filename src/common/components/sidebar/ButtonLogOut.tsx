import { LogOut } from 'lucide-react';

import { Button } from '../ui/button';

function ButtonLogOut() {
	return (
		<Button variant="outline" size="icon" data-test="sidebar-btn-logout">
			<LogOut className="h-[1.2rem] w-[1.2rem]" />
		</Button>
	);
}

export default ButtonLogOut;
