import { useMutation, useQueryClient } from '@tanstack/react-query';

import useAxios from '../hooks/useAxios';

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
		}: {
			id: string;
			name?: string;
			folderId?: string;
		}) =>
			axios
				?.patch('/invocation', {
					id,
					name,
					folderId,
				})
				.then((res) => res.data),

		// TODO Fix this when folderId is coming from the invocation
		// onMutate: async (invocation) => {
		// 	await queryClient.cancelQueries({ queryKey: ['folders'] });

		// 	const previousFolders = queryClient.getQueryData<Folder[]>(['folders']);

		// 	queryClient.setQueryData(
		// 		['folders'],
		// 		previousFolders?.map((folder) => {
		// 			if (folder.id === invocation.folderId) {
		// 				return {
		// 					...folder,
		// 					invocations: folder.invocations.map((inv) => {
		// 						if (inv.id === invocation.id) {
		// 							return invocation;
		// 						}

		// 						return inv;
		// 					}),
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

export const useDeleteInvocationMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			axios?.delete(`/invocation/${id}`).then((res) => res.data),

		// TODO Fix this when folderId is coming from the invocation
		// onMutate: async (id) => {
		// 	await queryClient.cancelQueries({ queryKey: ['folders'] });

		// 	const previousFolders = queryClient.getQueryData<Folder[]>(['folders']);

		// 	queryClient.setQueryData(
		// 		['folders'],
		// 		previousFolders?.filter((folder) => {
		// 			if (folder.id === id) {
		// 				return folder.invocations.filter((inv) => inv.id !== id);
		// 			}

		// 			return folder;
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
