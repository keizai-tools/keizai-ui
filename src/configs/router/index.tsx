import { Navigate, createBrowserRouter } from 'react-router-dom';

import CollectionVariables from '@/common/components/Collections/CollectionVariables';
import ChangePassword from '@/common/components/auth/ChangePassword';
import CreateAccount from '@/common/components/auth/CreateAccount';
import Login from '@/common/components/auth/Login';
import RecoverPassword from '@/common/components/auth/RecoverPassword';
import ResetPassword from '@/common/components/auth/ResetPassword';
import CollectionCTAPage from '@/pages/Collection/CollectionCTAPage';
import CollectionPage from '@/pages/Collection/CollectionPage';
import InvocationPage from '@/pages/Invocation/InvocationPage';
import AuthPage from '@/pages/auth/AuthPage';
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
				element: <Home />,
			},
			{
				path: 'change-password',
				element: <ChangePassword />,
			},
			{
				path: 'collection/:collectionId',
				element: <CollectionPage />,
				children: [
					{
						index: true,
						element: <CollectionCTAPage />,
					},
					{
						path: 'variables',
						element: <CollectionVariables />,
					},
					{
						path: 'invocation/:invocationId',
						element: <InvocationPage />,
					},
				],
			},
		],
	},
	{
		path: '/auth',
		element: <AuthPage />,
		children: [
			{
				index: true,
				element: <Login />,
			},
			{
				path: 'login',
				element: <Login />,
			},
			{
				path: 'register',
				element: <CreateAccount />,
			},
			{
				path: 'forgot-password',
				element: <RecoverPassword />,
			},
			{
				path: 'reset-password',
				element: <ResetPassword />,
			},
		],
	},
	{
		path: '*',
		element: <Navigate to="/" />,
	},
]);

export default router;
