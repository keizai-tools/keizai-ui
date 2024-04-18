import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useAxios from '../hooks/useAxios';
import { Method } from '../types/method';

export const useMethodQuery = ({ id }: { id?: string }) => {
	const axios = useAxios();

	const query = useQuery<Method>({
		queryKey: ['method', id],
		queryFn: async () => axios?.get(`/method/${id}`).then((res) => res.data),
		enabled: !!id,
	});

	return query;
};

export const useEditParametersMethodMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();

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
				?.patch(`/method`, {
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
