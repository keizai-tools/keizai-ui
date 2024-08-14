import { Navigate, createBrowserRouter } from 'react-router-dom';

import { CollectionVariablesContainer } from '@/common/components/collections/collectionVariablesContainer';
import AuthPage from '@/pages/auth/authPage';
import ChangePassword from '@/pages/auth/changePassword';
import CreateAccount from '@/pages/auth/createAccount';
import Login from '@/pages/auth/login';
import ProtectedRoute from '@/pages/auth/protectedRoute';
import RecoverPassword from '@/pages/auth/recoverPassword';
import ResetPassword from '@/pages/auth/resetPassword';
import CollectionCTAPage from '@/pages/collection/collectionCTAPage';
import CollectionPage from '@/pages/collection/collectionPage';
import Home from '@/pages/home/home';
import InvocationPage from '@/pages/invocation/invocationPage';
import Providers from '@/providers/providers';

import Root from '@pages/Root';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Providers />,
		children: [
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
								element: <CollectionVariablesContainer />,
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
		],
	},
	{
		path: '*',
		element: <Navigate to="/" />,
	},
]);

export default router;
