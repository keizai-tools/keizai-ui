import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { Collection } from '../types/collection';

import { IApiResponse } from '@/configs/axios/interfaces/IApiResponse';
import { apiService } from '@/configs/axios/services/api.service';

export const useCollectionsQuery = () => {
	const query = useQuery<Collection[]>({
		queryKey: ['collections'],
		queryFn: async () =>
			apiService?.get<IApiResponse<Collection[]>>('/collection').then((res) => {
				return res.payload;
			}),
	});

	return query;
};

export const useCollectionQuery = (collectionId: string | undefined) => {
	const query = useQuery<Collection>({
		queryKey: ['collection', collectionId],
		queryFn: async () =>
			apiService
				?.get<IApiResponse<Collection>>(`/collection/${collectionId}`)
				.then((res) => {
					return res.payload;
				}),
	});

	return query;
};

export const useNewCollectionMutation = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const mutation = useMutation({
		mutationFn: async ({ name }: { name: string }) =>
			apiService
				?.post<IApiResponse<Collection>>('/collection', { name })
				.then((res) => res.payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['collections'] });
			navigate(`/collection/${data.id}`);
		},
	});

	return mutation;
};

export const useDeleteCollectionMutation = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) =>
			apiService
				?.delete<IApiResponse<boolean>>(`/collection/${id}`)
				.then((res) => res.payload),
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

	const mutation = useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) =>
			apiService
				?.patch<IApiResponse<Collection>>(`/collection/`, { id, name })
				.then((res) => res.payload),
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
