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
