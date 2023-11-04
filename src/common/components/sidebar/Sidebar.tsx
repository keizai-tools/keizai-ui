import { Copy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import UserButton from './UserButton';

function Sidebar() {
	const location = useLocation();
	const currentRoute = location.pathname;
	return (
		<div
			className="h-screen w-[80px] flex flex-col items-center justify-between bg-foreground dark:bg-background border-r dark:border-r-border py-4"
			data-test="sidebar-container"
		>
			<div className="flex flex-col items-center">
				<img
					src="/logo.svg"
					width={45}
					height={45}
					alt="Keizai Logo"
					data-test="sidebar-img"
				/>
				<div className="flex flex-col mt-4 items-center">
					<Link
						to="/"
						data-test="sidebar-link"
						className={`hover:text-primary p-4 ${
							currentRoute === '/' && 'text-primary'
						}`}
					>
						<Copy data-test="sidebar-btn-copy" />
					</Link>
				</div>
			</div>
			<div className="flex flex-col gap-2 mb-4">
				<UserButton />
			</div>
		</div>
	);
}

export default Sidebar;
