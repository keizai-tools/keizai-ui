import { useEffect } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';

import FullscreenLoading from '@/common/views/fullscreenLoading';
import { useAuthProvider } from '@/modules/auth/hooks/useAuthProvider';

function AuthPage() {
  const { handleRefreshSession, statusState } = useAuthProvider();

  useEffect(() => {
    handleRefreshSession();
  }, [handleRefreshSession]);

  if (statusState.refreshSession.loading) {
    return <FullscreenLoading />;
  }

  if (statusState.refreshSession.status) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="h-screen md:flex" data-test="auth-page-container">
      <div
        className="relative grid grid-rows-1 overflow-hidden md:w-2/5 bg-primary rounded-b-xl md:rounded-b-none md:rounded-r-2xl"
        data-test="auth-page-banner-container"
      >
        <div className="flex flex-col items-center w-full mb-4 md:gap-2 md:mt-12">
          <img
            src="/welcome.svg"
            alt="Welcome"
            className="w-52 h-52 md:mb-4 md:w-[400px] md:h-[400px]"
            data-test="auth-page-banner-img"
          />
          <h1
            className="text-4xl font-extrabold text-black lg:text-5xl"
            data-test="auth-page-banner-title"
          >
            Discover Keizai
          </h1>
          <p className="font-bold text-black" data-test="auth-page-banner-info">
            Next-gen testing for Soroban.
          </p>
        </div>
        <footer className="hidden mb-4 text-center md:block">
          <Link
            to="https://www.keizai.dev/"
            target="_blank"
            className="font-bold text-black underline"
            data-test="auth-page-banner-link"
          >
            keizai.dev
          </Link>
        </footer>
      </div>
      <div className="flex items-center justify-center py-10 md:w-3/5">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;
