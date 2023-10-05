import { Navigate, createBrowserRouter } from 'react-router-dom';

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
		path: '*',
		element: <Navigate to="/" />,
	},
]);

export default router;
