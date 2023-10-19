import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import useAxios from '../hooks/useAxios';

import { Collection } from '@/providers/CollectionsProvider';

export const useCollectionsQuery = () => {
	const axios = useAxios();

	const query = useQuery<Collection[]>({
		queryKey: ['collections'],
		queryFn: async () => axios?.get('/collection').then((res) => res.data),
	});

	return query;
};

export const useNewCollectionMutation = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({ name }: { name: string }) =>
			axios?.post('/collection', { name }).then((res) => res.data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['collections'] });
			navigate(`/collection/${data.id}`);
		},
	});

	return mutation;
};

export const useDeleteCollectionMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			axios?.delete(`/collection/${id}`).then((res) => res.data),
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

export const useUpdateCollectionMutation = () => {
	const queryClient = useQueryClient();
	const axios = useAxios();

	const mutation = useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) =>
			axios?.patch(`/collection/`, { id, name }).then((res) => res.data),
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
