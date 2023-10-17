import { useMutation } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';

import useAuth from '@/services/auth/hook/useAuth';

function ButtonLogOut() {
	const { logoutUser } = useAuth();
	const navigate = useNavigate();
	const { mutate } = useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			navigate('/login');
		},
	});

	const onLogOut = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const username = 'jorge.luis@test.com';
		mutate(username);
	};
	return (
		<Button
			variant="outline"
			size="icon"
			data-test="sidebar-btn-logout"
			onClick={onLogOut}
		>
			<LogOut className="h-[1.2rem] w-[1.2rem]" />
		</Button>
	);
}

export default ButtonLogOut;
