import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useAxios from '../hooks/useAxios';
import { Folder } from '../types/folder';

export const useFoldersQuery = () => {
	const axios = useAxios();

	const query = useQuery<Folder[]>({
		queryKey: ['folders'],
		queryFn: async () => axios?.get('/folder').then((res) => res.data),
	});

	return query;
};

export const useFolderQuery = ({ id }: { id?: string }) => {
	const axios = useAxios();

	const query = useQuery<Folder>({
		queryKey: ['folder', id],
		queryFn: async () => axios?.get(`/folder/${id}`).then((res) => res.data),
		enabled: !!id,
	});

	return query;
};

export const useFoldersByCollectionIdQuery = ({ id }: { id?: string }) => {
	const axios = useAxios();

	const query = useQuery<Folder[]>({
		queryKey: ['collection', id, 'folders'],
		queryFn: async () =>
			axios?.get(`/collection/${id}/folders`).then((res) => res.data),
		enabled: !!id,
	});

	return query;
};

export const useCreateFolderMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({
			name,
			collectionId,
		}: {
			name: string;
			collectionId: string;
		}) =>
			axios?.post('/folder', { name, collectionId }).then((res) => res.data),
		onSuccess: (_, { collectionId }) => {
			queryClient.invalidateQueries({
				queryKey: ['collection', collectionId, 'folders'],
			});
		},
	});

	return mutation;
};

export const useDeleteFolderMutation = ({
	collectionId,
}: {
	collectionId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			axios?.delete(`/folder/${id}`).then((res) => res.data),
		onMutate: async (id) => {
			await queryClient.cancelQueries({
				queryKey: ['collection', collectionId, 'folders'],
			});

			const previousFolders = queryClient.getQueryData<Folder[]>([
				'collection',
				collectionId,
				'folders',
			]);

			queryClient.setQueryData(
				['collection', collectionId, 'folders'],
				previousFolders?.filter((folder) => folder.id !== id),
			);

			return {
				previousFolders,
			};
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', collectionId, 'folders'],
			});
		},
	});

	return mutation;
};

export const useEditFolderMutation = ({
	collectionId,
}: {
	collectionId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) =>
			axios?.patch('/folder', { id, name }).then((res) => res.data),
		onMutate: async ({ id, name }) => {
			await queryClient.cancelQueries({
				queryKey: ['collection', collectionId, 'folders'],
			});

			const previousFolders = queryClient.getQueryData<Folder[]>([
				'collection',
				collectionId,
				'folders',
			]);

			queryClient.setQueryData(
				['collection', collectionId, 'folders'],
				previousFolders?.map((folder) =>
					folder.id === id ? { ...folder, name } : folder,
				),
			);

			return {
				previousFolders,
			};
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['collection', collectionId, 'folders'],
			});
		},
	});

	return mutation;
};
