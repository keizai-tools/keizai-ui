import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import useAxios from '../hooks/useAxios';
import { useEndpoint } from '../hooks/useEndpoint';
import { Folder } from '../types/folder';

export const useFoldersQuery = (teamId?: string) => {
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'folder');

	const query = useQuery<Folder[]>({
		queryKey: ['folders'],
		queryFn: async () => axios?.get(apiUrl).then((res) => res.data),
	});

	return query;
};

export const useFolderQuery = ({
	id,
	teamId,
}: {
	id?: string;
	teamId?: string;
}) => {
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'folder');

	const query = useQuery<Folder>({
		queryKey: ['folder', id],
		queryFn: async () => axios?.get(`${apiUrl}/${id}`).then((res) => res.data),
		enabled: !!id,
	});

	return query;
};

export const useFoldersByCollectionIdQuery = ({
	collectionId,
	teamId,
}: {
	collectionId?: string;
	teamId?: string;
}) => {
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'collection');

	const query = useQuery<Folder[]>({
		queryKey: ['collection', collectionId, 'folders'],
		queryFn: async () =>
			axios?.get(`${apiUrl}/${collectionId}/folders`).then((res) => res.data),
		enabled: !!collectionId,
	});

	return query;
};

export const useCreateFolderMutation = (teamId?: string) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'folder');

	const mutation = useMutation({
		mutationFn: async ({
			name,
			collectionId,
		}: {
			name: string;
			collectionId: string;
		}) => axios?.post(apiUrl, { name, collectionId }).then((res) => res.data),
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
	teamId,
}: {
	collectionId?: string;
	teamId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'folder');

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			axios?.delete(`${apiUrl}/${id}`).then((res) => res.data),
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
	teamId,
}: {
	collectionId?: string;
	teamId?: string;
}) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'folder');

	const mutation = useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) =>
			axios?.patch(apiUrl, { id, name }).then((res) => res.data),
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
