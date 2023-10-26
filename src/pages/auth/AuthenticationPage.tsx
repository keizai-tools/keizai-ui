import { Link, Navigate, useLocation } from 'react-router-dom';

import CreateAccount from '@/common/components/auth/aws/CreateAccount';
import Login from '@/common/components/auth/aws/Login';
import FullscreenLoading from '@/common/views/FullscreenLoading';
import { useAuth } from '@/services/auth/hook/useAuth';

function AuthenticationPage() {
	const location = useLocation();
	const { isLoading, isAuthenticated } = useAuth();

	if (isLoading) {
		return <FullscreenLoading />;
	}

	if (isAuthenticated) {
		return <Navigate replace to="/" />;
	}

	return (
		<div className="h-screen md:flex" data-test="auth-page-container">
			<div
				className="relative overflow-hidden grid grid-rows-1 md:w-2/5 bg-primary  rounded-b-xl md:rounded-b-none md:rounded-r-2xl"
				data-test="auth-page-banner-container"
			>
				<div className="flex flex-col items-center w-full md:gap-2 md:mt-12 mb-4">
					<img
						src="/welcome.svg"
						alt="Welcome image"
						className="w-52 h-52 md:mb-4 md:w-[400px] md:h-[400px]"
						data-test="auth-page-banner-img"
					/>
					<h1
						className="text-4xl lg:text-5xl text-black font-extrabold"
						data-test="auth-page-banner-title"
					>
						Discover Keizai
					</h1>
					<p className="text-black font-bold" data-test="auth-page-banner-info">
						Next-gen testing for Soroban.
					</p>
				</div>
				<footer className="text-center mb-4 hidden md:block">
					<Link
						to="https://www.keizai.dev/"
						target="_blank"
						className="underline text-black font-bold"
						data-test="auth-page-banner-link"
					>
						keizai.dev
					</Link>
				</footer>
			</div>
			<div className="flex md:w-3/5 justify-center py-10 items-center">
				{location.pathname === '/login' ? <Login /> : <CreateAccount />}
			</div>
		</div>
	);
}

export default AuthenticationPage;
