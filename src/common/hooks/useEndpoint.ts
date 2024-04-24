import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

export function useEndpoint() {
	const [endpoint, setEndpoint] = React.useState<string>('');
	const [sidebarLink, setSidebarLink] = React.useState<string>('');
	const { teamId } = useParams();
	const { pathname } = useLocation();

	React.useEffect(() => {
		teamId ? setEndpoint(`/team/${teamId}`) : setEndpoint('/user');

		setSidebarLink(
			pathname !== '/' && pathname !== '/change-password' ? endpoint : '/',
		);
	}, [endpoint, pathname, teamId]);

	const getEndpoint = (teamId: string | undefined, path: string) => {
		return {
			apiUrl: teamId ? `/team/${teamId}/${path}` : `/${path}`,
			navUrl: teamId ? `/team/${teamId}` : '/user',
		};
	};

	return { endpoint, sidebarLink, getEndpoint };
}
