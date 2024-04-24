import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import useAxios from '../hooks/useAxios';
import { useEndpoint } from '../hooks/useEndpoint';
import { Method } from '../types/method';

export const useMethodQuery = ({ id }: { id?: string }) => {
	const axios = useAxios();
	const { teamId } = useParams();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'method');

	const query = useQuery<Method>({
		queryKey: ['method', id],
		queryFn: async () => axios?.get(`${apiUrl}/${id}`).then((res) => res.data),
		enabled: !!id,
	});

	return query;
};

export const useEditParametersMethodMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { teamId } = useParams();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'method');

	const mutation = useMutation({
		mutationFn: async ({
			id,
			invocationId,
			parameters,
		}: {
			id: string;
			invocationId: string;
			parameters: { name: string; value: string }[];
		}) =>
			axios
				?.patch(apiUrl, {
					id,
					invocationId,
					params: parameters,
				})
				.then((res) => res.data),
		onSettled: (_, __, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['method', id] });
		},
	});

	return mutation;
};
