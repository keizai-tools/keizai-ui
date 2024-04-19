import { Badge, Copy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import SettingButton from './SettingButton';
import UserButton from './UserButton';

import { useTeamsQuery } from '@/common/api/teams';
import { Team } from '@/common/types/team';

function SidebarV2() {
	const { data } = useTeamsQuery();
	const { pathname } = useLocation();

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
				<Badge className="mt-2">BETA</Badge>
				<div className="flex flex-col mt-4 items-center">
					<Link
						to="/"
						data-test="sidebar-link"
						className={`hover:text-primary p-4 ${
							pathname === '/' && 'text-primary'
						}`}
					>
						<Copy data-test="sidebar-btn-copy" />
					</Link>
					{pathname !== '/' && (
						<UserButton teams={data as Team[]} currentRoute={pathname} />
					)}
				</div>
			</div>
			<div className="flex flex-col gap-2 mb-4">
				<SettingButton />
			</div>
		</div>
	);
}

export default SidebarV2;
