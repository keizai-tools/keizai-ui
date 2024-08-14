import { useFlags } from 'flagsmith/react';
import { Outlet } from 'react-router-dom';

import FeedbackPopupButton from '@/common/components/feedbackPopupButton/feedbackPopupButton';
import { AppLoader } from '@/common/components/loader/appLoader';
import Sidebar from '@/common/components/sidebar/sidebar';
import SidebarV2 from '@/common/components/sidebar/sidebarV2';

export default function Root() {
	const flags = useFlags(['teams']);

	return (
		<main className="flex min-h-screen bg-background">
			{flags.teams.enabled ? <SidebarV2 /> : <Sidebar />}
			<AppLoader>
				<Outlet />
				<FeedbackPopupButton />
			</AppLoader>
		</main>
	);
}
