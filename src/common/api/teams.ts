import { useQuery } from '@tanstack/react-query';

import useAxios from '../hooks/useAxios';
import { Team } from '../types/team';

export const useTeamsQuery = () => {
	const axios = useAxios();
	const query = useQuery<Team[]>({
		queryKey: ['teams'],
		queryFn: async () => axios?.get('team').then((res) => res.data),
	});
	return query;
};

export const useTeamQuery = (teamId: string) => {
	const axios = useAxios();
	const query = useQuery<Team>({
		queryKey: ['team', teamId],
		queryFn: async () => axios?.get(`/team/${teamId}`).then((res) => res.data),
	});
	return query;
};
