import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import useAxios from '../hooks/useAxios';
import { Invocation, InvocationResponse } from '../types/invocation';

export const useInvocationQuery = ({ id }: { id?: string }) => {
	const axios = useAxios();

	const query = useQuery<Invocation>({
		queryKey: ['invocation', id],
		queryFn: async () =>
			axios?.get(`/invocation/${id}`).then((res) => res.data),
		enabled: !!id,
	});

	return query;
};

export const useRunInvocationQuery = ({ id }: { id?: string }) => {
	const axios = useAxios();

	return () => {
		return axios
			?.get<InvocationResponse>(`/invocation/${id}/run`)
			.then((res) => res.data);
	};
};

export const useCreateInvocationMutation = () => {
	const params = useParams();
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({
			name,
			folderId,
		}: {
			name: string;
			folderId: string;
		}) =>
			axios
				?.post('/invocation', {
					name,
					folderId,
				})
				.then((res) => res.data),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', params.collectionId, 'folders'],
			});
		},
	});

	return mutation;
};

export const useEditInvocationMutation = () => {
	const params = useParams();
	const queryClient = useQueryClient();
	const axios = useAxios();

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
				?.patch('/invocation', {
					id,
					name,
					folderId,
					contractId,
					selectedMethodId,
				})
				.then((res) => res.data),
		onSuccess: (_, { name, id }) => {
			if (name) {
				queryClient.invalidateQueries({
					queryKey: ['collection', params.collectionId, 'folders'],
				});
			} else {
				queryClient.invalidateQueries({ queryKey: ['invocation', id] });
			}
		},
	});

	return mutation;
};

export const useEditSelectedMethodMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			selectedMethodId,
		}: {
			id: string;
			selectedMethodId?: string;
		}) =>
			axios
				?.patch('/invocation', {
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

export const useDeleteInvocationMutation = () => {
	const params = useParams();
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			axios?.delete(`/invocation/${id}`).then((res) => res.data),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', params.collectionId, 'folders'],
			});
		},
	});

	return mutation;
};

export const useEditNetworkMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({ network, id }: { network: string; id: string }) =>
			axios?.patch(`/invocation`, {
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
	});
	return mutation;
};

export const useEditInvocationKeysMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();

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
				?.patch('/invocation', {
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

export const useEditPreInvocationMutation = () => {
	const axios = useAxios();
	const queryClient = useQueryClient();
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
				?.patch('/invocation', {
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
