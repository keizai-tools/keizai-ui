import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from '../components/ui/use-toast';
import { Environment } from '../types/environment';

import { IApiResponse } from '@/config/axios/interfaces/IApiResponse';
import { apiService } from '@/config/axios/services/api.service';

export const useEnvironmentsQuery = ({
	collectionId,
}: {
	collectionId?: string | undefined;
}) => {
	const query = useQuery<Environment[]>({
		queryKey: ['environment', collectionId],
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		queryFn: async () =>
			apiService
				?.get<IApiResponse<Environment[]>>(
					`/collection/${collectionId}/environments`,
				)
				.then((res) => res.payload),
	});

	return query;
};

export const useEnvironmentQuery = ({ id }: { id?: string }) => {
	const query = useQuery<Environment>({
		queryKey: ['environment', id],
		queryFn: async () =>
			apiService
				?.get<IApiResponse<Environment>>(`/environment/${id}`)
				.then((res) => res.payload),
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
			apiService
				?.post<IApiResponse<Environment>>('/environment', {
					name,
					value,
					collectionId,
				})
				.then((res) => res.payload),
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

export const useCreateAllEnvironmentsMutation = ({
	collectionId,
}: {
	collectionId?: string;
}) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (environments: Environment[]) =>
			apiService
				?.post<IApiResponse<Environment>>(
					`/collection/${collectionId}/environments`,
					environments,
				)
				.then((res) => res.payload),
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

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			apiService
				?.delete<IApiResponse<boolean>>(`/environment/${id}`)
				.then((res) => res.payload),
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
			apiService
				?.patch<IApiResponse<Environment>>('/environment', {
					id,
					name,
					value,
					collectionId,
				})
				.then((res) => res.payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['environment', collectionId],
			});
		},
		onError: (variables: Environment) => {
			toast({
				title: 'Something went wrong!',
				description: `Couldn't edit a variable: ${variables.name}`,
				variant: 'destructive',
			});
		},
	});

	return mutation;
};
