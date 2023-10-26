import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useAxios from '../hooks/useAxios';
import { Invocation } from '../types/invocation';

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

export const useCreateInvocationMutation = () => {
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
		// onMutate: async (invocation) => {
		// 	await queryClient.cancelQueries({ queryKey: ['folders'] });

		// 	const previousFolders = queryClient.getQueryData<Folder[]>(['folders']);

		// 	queryClient.setQueryData(
		// 		['folders'],
		// 		previousFolders?.map((folder) => {
		// 			if (folder.id === invocation.folderId) {
		// 				return {
		// 					...folder,
		// 					invocations: [invocation, ...folder.invocations],
		// 				};
		// 			}
		// 		}),
		// 	);

		// 	return {
		// 		previousFolders,
		// 	};
		// },
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});

	return mutation;
};

export const useEditInvocationMutation = () => {
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
				queryClient.invalidateQueries({ queryKey: ['folders'] });
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
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			axios?.delete(`/invocation/${id}`).then((res) => res.data),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['folders'] });
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
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['invocation', id] });
		},
	});

	return mutation;
};
