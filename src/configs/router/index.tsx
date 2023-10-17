import { Navigate, createBrowserRouter } from 'react-router-dom';

import AuthenticationPage from '@/pages/auth/AuthenticationPage';

import Root from '@pages/Root';
import Home from '@pages/home/Home';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				index: true,
				element: <Home />,
			},
		],
	},
	{
		path: 'login',
		element: <AuthenticationPage />,
	},
	{
		path: 'register',
		element: <AuthenticationPage />,
	},
	{
		path: '*',
		element: <Navigate to="/" />,
	},
]);

export default router;
