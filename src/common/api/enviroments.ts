import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useAxios from '../hooks/useAxios';
import { Environment } from '../types/environment';

export const useEnvironmentsQuery = ({
	collectionId,
}: {
	collectionId?: string;
}) => {
	const axios = useAxios();

	const query = useQuery<Environment[]>({
		queryKey: ['environment', collectionId],
		queryFn: async () => axios?.get('/enviroment').then((res) => res.data),
	});

	return query;
};

export const useEnvironmentQuery = ({ id }: { id?: string }) => {
	const axios = useAxios();

	const query = useQuery<Environment>({
		queryKey: ['environment', id],
		queryFn: async () =>
			axios?.get(`/enviroment/${id}`).then((res) => res.data),
		enabled: !!id,
	});

	return query;
};

export const useCreateEnvironmentMutation = ({
	collectionId,
}: {
	collectionId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({
			name,
			value,
			collectionId,
		}: {
			name: string;
			value: string;
			collectionId: string;
		}) =>
			axios
				?.post('/enviroment', { name, value, collectionId })
				.then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', collectionId, 'variables'],
			});
		},
	});

	return mutation;
};

export const useDeleteEnvironmentMutation = ({
	collectionId,
}: {
	collectionId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			axios?.delete(`/enviroment/${id}`).then((res) => res.data),
		onMutate: (id: string) => {
			queryClient.cancelQueries({
				queryKey: ['collection', collectionId, 'variables'],
			});
			const oldEnvs = queryClient.getQueryData<Environment[]>(['enviroment']);
			queryClient.setQueryData<Environment[]>(['enviroment'], (oldData) => {
				return oldData?.filter((env) => env.id !== id);
			});
			return { oldEnvs };
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', collectionId, 'variables'],
			});
		},
	});

	return mutation;
};

export const useEditEnvironmentMutation = ({
	collectionId,
}: {
	collectionId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			name,
			value,
			collectionId,
		}: {
			id: string;
			name: string;
			value: string;
			collectionId: string;
		}) =>
			axios
				?.patch('/enviroment', {
					id,
					name,
					value,
					collectionId,
				})
				.then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', collectionId, 'environments'],
			});
		},
	});

	return mutation;
};
