import { useFlags } from 'flagsmith/react';
import { Outlet } from 'react-router-dom';

import FeedbackPopupButton from '@/common/components/FeedbackPopupButton/FeedbackPopupButton';
import { AppLoader } from '@/common/components/Loader/AppLoader';
import Sidebar from '@/common/components/sidebar/Sidebar';
import SidebarV2 from '@/common/components/sidebar/SidebarV2';

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
