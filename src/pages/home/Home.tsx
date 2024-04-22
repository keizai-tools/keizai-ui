import { User2, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useTeamsQuery } from '@/common/api/teams';
import FullscreenLoading from '@/common/views/FullscreenLoading';

export default function Home() {
	const { data: teams, isLoading } = useTeamsQuery();
	const navigate = useNavigate();

	if (isLoading) {
		return <FullscreenLoading />;
	}

	return (
		<section
			className="flex flex-col w-full max-w-[500px] h-screen pt-[20vh] m-auto"
			data-test="home-page-container"
		>
			<h1
				className="text-4xl font-bold text-primary"
				data-test="home-header-title"
			>
				Workspaces
			</h1>
			<div className="mt-8">
				<ul className="flex flex-col" data-test="home-workspace-list-container">
					<li
						className=" cursor-pointer pr-8 py-4 hover:bg-accent border-t border-b  border-border"
						data-test="home-workspace-list-user"
					>
						<div
							className="flex items-center gap-4 px-4"
							onClick={() => navigate('/user')}
						>
							<User2 className="h-6 w-6 text-slate-500" />
							<p>My Personal account</p>
						</div>
					</li>
					{teams?.map((team) => {
						return (
							<li
								className="cursor-pointer pr-8 py-4 hover:bg-accent border-b border-border"
								key={team.id}
								data-test="home-workspace-list-team"
							>
								<div
									className="flex items-center gap-4 px-4"
									onClick={() => navigate(`/team/${team?.id}`)}
								>
									<UsersRound className="h-6 w-6 text-slate-500" />
									<p>{team.name}</p>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
