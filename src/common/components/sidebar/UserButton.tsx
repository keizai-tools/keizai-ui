import { User2, UsersRound } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';

import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { Team } from '@/common/types/team';

function UserButton({
	teams,
	currentRoute,
}: {
	teams: Team[];
	currentRoute: string;
}) {
	const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
	const navigate = useNavigate();
	console.log(currentRoute);
	const handleCheckedChange = (itemName: string) => {
		setSelectedItem(itemName === selectedItem ? null : itemName);
	};

	React.useEffect(() => {
		if (currentRoute === '/user') {
			setSelectedItem('/user');
		}

		setSelectedItem(currentRoute);
	}, [currentRoute]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" data-test="sidebar-btn-user">
					<User2 className="h-[1.2rem] w-[1.2rem]" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side="right"
				align="start"
				data-test="user-dropdown-container"
			>
				<DropdownMenuCheckboxItem
					data-test="user-dropdown-user-item"
					className="flex items-center gap-2 cursor-pointer pr-8 py-2"
					checked={selectedItem === '/user'}
					onCheckedChange={() => handleCheckedChange('user')}
					onClick={() => navigate('/user')}
				>
					<User2 className="h-4 w-4" />
					<span>Personal account</span>
				</DropdownMenuCheckboxItem>
				{teams?.map((team) => {
					return (
						<DropdownMenuCheckboxItem
							key={team?.id}
							data-test="user-dropdown-team-item"
							className="flex items-center gap-2 cursor-pointer pr-8 py-2 mt-1"
							checked={selectedItem === `/team/${team?.id}`}
							onCheckedChange={() => handleCheckedChange(`/team/${team?.id}`)}
							onClick={() => navigate(`/team/${team?.id}`)}
						>
							<UsersRound className="h-4 w-4" />
							<span>{team?.name}</span>
						</DropdownMenuCheckboxItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserButton;
