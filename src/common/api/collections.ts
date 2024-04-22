import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import useAxios from '../hooks/useAxios';
import { useEndpoint } from '../hooks/useEndpoint';
import { Collection } from '../types/collection';

export const useCollectionsQuery = (teamId?: string) => {
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'collection');

	const query = useQuery<Collection[]>({
		queryKey: ['collections'],
		queryFn: async () => axios?.get(apiUrl).then((res) => res.data),
	});

	return query;
};

export const useCollectionQuery = (teamId?: string, collectionId?: string) => {
	const axios = useAxios();

	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'collection');

	const query = useQuery<Collection>({
		queryKey: ['collection', collectionId],
		queryFn: async () =>
			axios?.get(`${apiUrl}/${collectionId}`).then((res) => res.data),
	});

	return query;
};

export const useNewCollectionMutation = (teamId?: string) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl, navUrl } = getEndpoint(teamId, 'collection');

	const mutation = useMutation({
		mutationFn: async ({ name }: { name: string }) =>
			axios?.post(apiUrl, { name }).then((res) => res.data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['collections'] });
			navigate(`${navUrl}/collection/${data.id}`);
		},
	});

	return mutation;
};

export const useDeleteCollectionMutation = (teamId?: string) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'collection');

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			axios?.delete(`${apiUrl}/${id}`).then((res) => res.data),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ['collections'] });

			const previousCollections = queryClient.getQueryData<Collection[]>([
				'collections',
			]);

			queryClient.setQueryData(
				['collections'],
				previousCollections?.filter((collection) => collection.id !== id),
			);
			return {
				previousCollections,
			};
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['collections'] });
		},
	});

	return mutation;
};

export const useUpdateCollectionMutation = (teamId?: string) => {
	const queryClient = useQueryClient();
	const axios = useAxios();
	const { getEndpoint } = useEndpoint();

	const { apiUrl } = getEndpoint(teamId, 'collection');

	const mutation = useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) =>
			axios?.patch(`${apiUrl}/`, { id, name }).then((res) => res.data),
		onMutate: async ({ id, name }) => {
			await queryClient.cancelQueries({ queryKey: ['collections'] });

			const previousCollections = queryClient.getQueryData<Collection[]>([
				'collections',
			]);

			queryClient.setQueryData(
				['collections'],
				previousCollections?.map((collection) =>
					collection.id === id ? { ...collection, name } : collection,
				),
			);
			return {
				previousCollections,
			};
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['collections'] });
		},
	});

	return mutation;
};
