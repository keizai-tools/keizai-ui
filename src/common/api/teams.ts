import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

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

export const useCreateTeamMutation = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({
			name,
			usersEmails,
		}: {
			name: string;
			usersEmails: string[];
		}) => axios?.post('/team', { name, usersEmails }).then((res) => res.data),
		onSuccess: (data: Team) => {
			queryClient.invalidateQueries({ queryKey: ['teams'] });
			navigate(`/team/${data.id}`);
		},
	});
	return mutation;
};

export const useEditTeamMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({
			name,
			id,
			usersEmails,
		}: {
			name: string;
			id: string;
			usersEmails: string[];
		}) =>
			axios?.patch('/team', { name, id, usersEmails }).then((res) => res.data),
		onMutate: async ({ name, id }) => {
			await queryClient.cancelQueries({ queryKey: ['teams'] });
			const previousTeams = queryClient.getQueryData<Team[]>(['teams']);

			queryClient.setQueryData(
				['teams'],
				previousTeams?.map((team) =>
					team.id === id ? { ...team, name } : team,
				),
			);
			return {
				previousTeams,
			};
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['team'] });
		},
	});
	return mutation;
};

export const useDeleteTeamMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async (teamId: string) =>
			axios?.delete(`/team/${teamId}`).then((res) => res.data),
		onMutate: async (teamId) => {
			await queryClient.cancelQueries({ queryKey: ['teams'] });

			const previousTeams = queryClient.getQueryData<Team[]>(['collections']);

			queryClient.setQueryData(
				['collections'],
				previousTeams?.filter((team) => team.id !== teamId),
			);
			return {
				previousTeams,
			};
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['teams'] });
		},
	});

	return mutation;
};
