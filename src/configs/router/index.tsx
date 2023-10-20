import { Navigate, createBrowserRouter } from 'react-router-dom';

import CollectionCTAPage from '@/pages/Collection/CollectionCTAPage';
import CollectionPage from '@/pages/Collection/CollectionPage';
import InvocationPage from '@/pages/Invocation/InvocationPage';
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
				element: <Home />,
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
						path: 'invocation/:invocationId',
						element: <InvocationPage />,
					},
				],
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
