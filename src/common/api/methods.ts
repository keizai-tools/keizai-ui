import { useMutation, useQuery } from '@tanstack/react-query';

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
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			parameters,
		}: {
			id: string;
			parameters: { name: string; value: string }[];
		}) =>
			axios
				?.patch(`/method`, {
					id,
					params: parameters,
				})
				.then((res) => res.data),
	});

	return mutation;
};
