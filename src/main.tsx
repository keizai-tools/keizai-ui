import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import './index.css';
import Providers from './providers/Providers';

import router from '@configs/router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Providers>
		<RouterProvider router={router} />
	</Providers>,
);
