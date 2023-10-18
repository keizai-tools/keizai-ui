import { Navigate, createBrowserRouter } from 'react-router-dom';

import AuthenticationPage from '@/pages/auth/AuthenticationPage';
import ProtectedRoute from '@/pages/auth/ProtectedRoute';

import Root from '@pages/Root';
import Home from '@pages/home/Home';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<Root />
			</ProtectedRoute>
		),
		children: [
			{
				index: true,
				element: (
					<ProtectedRoute>
						<Home />
					</ProtectedRoute>
				),
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
