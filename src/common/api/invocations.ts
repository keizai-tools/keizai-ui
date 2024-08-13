import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { useToast } from '../components/ui/use-toast';
import { Invocation, InvocationResponse } from '../types/invocation';

import { IApiResponse } from '@/configs/axios/interfaces/IApiResponse';
import { apiService } from '@/configs/axios/services/api.service';

export function useInvocationQuery({ id }: { id?: string }) {
	const query = useQuery<Invocation>({
		queryKey: ['invocation', id],
		queryFn: async () =>
			apiService
				?.get<IApiResponse<Invocation>>(`/invocation/${id}`)
				.then((res) => res.payload),
		enabled: !!id,
	});

	return query;
}

export function useRunInvocationQuery({
	id,
	signedTransactionXDR,
}: {
	id?: string;
	signedTransactionXDR?: string;
}) {
	return async () => {
		const res = await apiService?.post<IApiResponse<InvocationResponse>>(
			`/invocation/${id}/run`,
			{
				signedTransactionXDR,
			},
		);
		return res.payload;
	};
}

export function usePrepareInvocationQuery({ id }: { id?: string }) {
	return async () => {
		const res = await apiService?.get<IApiResponse<string>>(
			`/invocation/${id}/prepare`,
		);
		return res.payload;
	};
}

export function useCreateInvocationMutation() {
	const params = useParams();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			name,
			folderId,
		}: {
			name: string;
			folderId: string;
		}) =>
			apiService
				?.post<IApiResponse<Invocation>>('/invocation', {
					name,
					folderId,
				})
				.then((res) => res.payload),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', params.collectionId, 'folders'],
			});
		},
	});

	return mutation;
}

export function useEditInvocationMutation() {
	const params = useParams();
	const queryClient = useQueryClient();

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
			apiService
				?.patch<IApiResponse<Invocation>>('/invocation', {
					id,
					name,
					folderId,
					contractId,
					selectedMethodId,
				})
				.then((res) => res.payload)
				.catch(() => {
					if (contractId) {
						window.umami.track('Error loading contract', { contractId });
					}
				}),
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
}

export function useEditSelectedMethodMutation() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			selectedMethodId,
		}: {
			id: string;
			selectedMethodId?: string;
		}) =>
			apiService
				?.patch<IApiResponse<Invocation>>('/invocation', {
					id,
					selectedMethodId,
				})
				.then((res) => res.payload),
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
}

export function useDeleteInvocationMutation() {
	const params = useParams();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			apiService
				?.delete<IApiResponse<boolean>>(`/invocation/${id}`)
				.then((res) => res.payload),
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', params.collectionId, 'folders'],
			});
		},
	});

	return mutation;
}

export function useEditNetworkMutation() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const mutation = useMutation({
		mutationFn: async ({ network, id }: { network: string; id: string }) =>
			apiService?.patch(`/invocation`, {
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
}

export function useEditInvocationKeysMutation() {
	const queryClient = useQueryClient();

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
			apiService
				?.patch<IApiResponse<Invocation>>('/invocation', {
					id,
					secretKey,
					publicKey,
				})
				.then((res) => res.payload),
		onSuccess: (data) => {
			queryClient.setQueryData(['invocation', data.id], data);
		},
	});

	return mutation;
}

export function useEditPreInvocationMutation() {
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
			apiService
				?.patch<IApiResponse<Invocation>>('/invocation', {
					id,
					preInvocation,
					postInvocation,
				})
				.then((res) => res.payload);
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
}
