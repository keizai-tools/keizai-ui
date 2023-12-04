import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '../components/ui/use-toast';
import useAxios from '../hooks/useAxios';
import { Environment } from '../types/environment';

export const useEnvironmentsQuery = ({
	collectionId,
}: {
	collectionId?: string | undefined;
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
				queryKey: ['environment', collectionId],
			});
			toast({
				title: 'Successfully!',
				description: 'The variables have been created correctly',
			});
		},
		onError: () => {
			toast({
				title: "Couldn't create variables",
				description: 'Please try again',
				variant: 'destructive',
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
				queryKey: ['environment', collectionId],
			});
			const oldEnvs = queryClient.getQueryData<Environment[]>([
				'environment',
				collectionId,
			]);
			queryClient.setQueryData<Environment[]>(
				['environment', collectionId],
				(oldData) => {
					return oldData?.filter((env) => env.id !== id);
				},
			);
			return { oldEnvs };
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['environment', collectionId],
			});
		},
		onError: () => {
			toast({
				title: "Couldn't delete a variable",
				description: 'Please try again',
				variant: 'destructive',
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
				queryKey: ['environment', collectionId],
			});
		},
		onError: (variables: AxiosError<Error>) => {
			toast({
				title: 'Something went wrong!',
				description: `Couldn't edit a variable: ${variables.response?.data?.message}`,
				variant: 'destructive',
			});
		},
	});

	return mutation;
};
