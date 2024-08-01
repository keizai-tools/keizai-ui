import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Method } from '../types/method';

import type { IApiResponse } from '@/configs/axios/interfaces/IApiResponse';
import { apiService } from '@/configs/axios/services/api.service';

export const useMethodQuery = ({ id }: { id?: string }) => {
	const query = useQuery<Method>({
		queryKey: ['method', id],
		queryFn: async () =>
			apiService
				?.get<IApiResponse<Method>>(`/method/${id}`)
				.then((res) => res.payload),
		enabled: !!id,
	});

	return query;
};

export const useEditParametersMethodMutation = () => {
	const queryClient = useQueryClient();

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
			apiService
				?.patch<IApiResponse<Method>>(`/method`, {
					id,
					invocationId,
					params: parameters,
				})
				.then((res) => res.payload),
		onSettled: (_, __, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['method', id] });
		},
	});

	return mutation;
};
