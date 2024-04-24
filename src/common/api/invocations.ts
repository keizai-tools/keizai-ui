import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { useToast } from '../components/ui/use-toast';
import useAxios from '../hooks/useAxios';
import { useEndpoint } from '../hooks/useEndpoint';
import { Invocation, InvocationResponse } from '../types/invocation';

export const useInvocationQuery = ({
	id,
	teamId,
}: {
	id?: string;
	teamId?: string;
}) => {
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'invocation');

	const query = useQuery<Invocation>({
		queryKey: ['invocation', id],
		queryFn: async () => axios?.get(`${apiUrl}/${id}`).then((res) => res.data),
		enabled: !!id,
	});

	return query;
};

export const useRunInvocationQuery = ({
	id,
	teamId,
}: {
	id?: string;
	teamId?: string;
}) => {
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'invocation');

	return () => {
		return axios
			?.get<InvocationResponse>(`${apiUrl}/${id}/run`)
			.then((res) => res.data);
	};
};

export const useCreateInvocationMutation = () => {
	const { collectionId, teamId } = useParams();
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'invocation');

	const mutation = useMutation({
		mutationFn: async ({
			name,
			folderId,
		}: {
			name: string;
			folderId: string;
		}) =>
			axios
				?.post(apiUrl, {
					name,
					folderId,
				})
				.then((res) => res.data),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', collectionId, 'folders'],
			});
		},
	});

	return mutation;
};

export const useEditInvocationMutation = () => {
	const { collectionId, teamId } = useParams();
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'invocation');

	const mutation = useMutation({
		mutationFn: async ({
			id,
			name,
			folderId,
			contractId,
			selectedMethodId,
		}: {
			id: string;
			name?: string;
			folderId?: string;
			contractId?: string;
			selectedMethodId?: string;
		}) =>
			axios
				?.patch(apiUrl, {
					id,
					name,
					folderId,
					contractId,
					selectedMethodId,
				})
				.then((res) => res.data)
				.catch(() => {
					if (contractId) {
						window.umami.track('Error loading contract', { contractId });
					}
				}),
		onSuccess: (_, { name, id }) => {
			if (name) {
				queryClient.invalidateQueries({
					queryKey: ['collection', collectionId, 'folders'],
				});
			} else {
				queryClient.invalidateQueries({ queryKey: ['invocation', id] });
			}
		},
	});

	return mutation;
};

export const useEditSelectedMethodMutation = () => {
	const { teamId } = useParams();
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'invocation');

	const mutation = useMutation({
		mutationFn: async ({
			id,
			selectedMethodId,
		}: {
			id: string;
			selectedMethodId?: string;
		}) =>
			axios
				?.patch(apiUrl, {
					id,
					selectedMethodId,
				})
				.then((res) => res.data),
		onMutate: async ({ id, selectedMethodId }) => {
			await queryClient.cancelQueries({ queryKey: ['invocation', id] });

			const previousInvocation = queryClient.getQueryData<Invocation>([
				'invocation',
				id,
			]);

			queryClient.setQueryData(['invocation', id], {
				...previousInvocation,
				selectedMethod: {
					id: selectedMethodId,
				},
			});

			return {
				previousInvocation,
			};
		},
	});

	return mutation;
};

export const useDeleteInvocationMutation = (
	collectionId?: string,
	teamId?: string,
) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'invocation');

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			axios?.delete(`${apiUrl}/${id}`).then((res) => res.data),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', collectionId, 'folders'],
			});
		},
	});

	return mutation;
};

export const useEditNetworkMutation = (teamId?: string) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { toast } = useToast();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'invocation');

	const mutation = useMutation({
		mutationFn: async ({ network, id }: { network: string; id: string }) =>
			axios?.patch(apiUrl, {
				network,
				id,
			}),
		onMutate: ({ network, id }) => {
			const previousInvocation = queryClient.getQueryData<Invocation>([
				'invocation',
				id,
			]);

			queryClient.setQueryData(['invocation', id], {
				...previousInvocation,
				network,
			});

			return {
				previousInvocation,
			};
		},
		onError: () => {
			toast({
				title: 'Something went wrong!',
				description: "Couldn't change network, please try again",
				variant: 'destructive',
			});
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['invocation', id] });
			toast({
				title: 'Successfully!',
				description: 'Network has been changed',
			});
		},
	});
	return mutation;
};

export const useEditInvocationKeysMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { teamId } = useParams();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'invocation');

	const mutation = useMutation({
		mutationFn: async ({
			id,
			secretKey,
			publicKey,
		}: {
			id: string;
			secretKey?: string;
			publicKey?: string;
		}) =>
			axios
				?.patch(apiUrl, {
					id,
					secretKey,
					publicKey,
				})
				.then((res) => res.data),
		onSuccess: (data) => {
			queryClient.setQueryData(['invocation', data.id], data);
		},
	});

	return mutation;
};

export const useEditPreInvocationMutation = (teamId?: string) => {
	const axios = useAxios();
	const queryClient = useQueryClient();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'invocation');

	const mutation = useMutation({
		mutationFn: async ({
			id,
			preInvocation,
			postInvocation,
		}: {
			id: string;
			preInvocation?: string;
			postInvocation?: string;
		}) => {
			axios
				?.patch(apiUrl, {
					id,
					preInvocation,
					postInvocation,
				})
				.then((res) => res.data);
		},
		onSuccess(_, variables) {
			const oldData = queryClient.getQueryData<Invocation>([
				'invocation',
				variables.id,
			]);
			queryClient.setQueryData(['invocation', variables.id], {
				...oldData,
				preInvocation: variables.preInvocation ?? oldData?.preInvocation,
				postInvocation: variables.postInvocation ?? oldData?.postInvocation,
			});
		},
	});
	return mutation;
};
