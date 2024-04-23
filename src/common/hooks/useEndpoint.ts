import React from 'react';
import { useParams } from 'react-router-dom';

export function useEndpoint() {
	const [endpoint, setEndpoint] = React.useState<string>('');
	const { teamId } = useParams();

	React.useEffect(() => {
		teamId ? setEndpoint(`/team/${teamId}`) : setEndpoint('/user');
	}, [teamId]);

	const getEndpoint = (teamId: string | undefined, path: string) => {
		return {
			apiUrl: teamId ? `/team/${teamId}/${path}` : `/${path}`,
			navUrl: teamId ? `/team/${teamId}` : '/user',
		};
	};

	return { endpoint, getEndpoint };
}
