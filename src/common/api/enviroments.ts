import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from '../components/ui/use-toast';
import useAxios from '../hooks/useAxios';
import { useEndpoint } from '../hooks/useEndpoint';
import { Environment } from '../types/environment';

export const useEnvironmentsQuery = ({
	collectionId,
	teamId,
}: {
	collectionId?: string;
	teamId?: string;
}) => {
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'collection');

	const query = useQuery<Environment[]>({
		queryKey: ['environment', collectionId],
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		queryFn: async () =>
			axios
				?.get(`${apiUrl}/${collectionId}/environments`)
				.then((res) => res.data),
	});

	return query;
};

export const useEnvironmentQuery = ({
	id,
	teamId,
}: {
	id?: string;
	teamId?: string;
}) => {
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'environment');

	const query = useQuery<Environment>({
		queryKey: ['environment', id],
		queryFn: async () => axios?.get(`${apiUrl}/${id}`).then((res) => res.data),
		enabled: !!id,
	});

	return query;
};

export const useCreateEnvironmentMutation = ({
	collectionId,
	teamId,
}: {
	collectionId?: string;
	teamId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'environment');

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
				?.post(apiUrl, { name, value, collectionId })
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

export const useCreateAllEnvironmentsMutation = ({
	collectionId,
	teamId,
}: {
	collectionId?: string;
	teamId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'collection');

	const mutation = useMutation({
		mutationFn: async (environments: Environment[]) =>
			axios
				?.post(`${apiUrl}/${collectionId}/environments`, environments)
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
	teamId,
}: {
	collectionId?: string;
	teamId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'environment');

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			axios?.delete(`${apiUrl}/${id}`).then((res) => res.data),
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
	teamId,
}: {
	collectionId?: string;
	teamId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'environment');

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
				?.patch(apiUrl, {
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
