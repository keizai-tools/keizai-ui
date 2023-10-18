import { useQuery } from '@tanstack/react-query';

import useAxios from '../hooks/useAxios';

export const useCollectionsQuery = () => {
	const axios = useAxios();

	const query = useQuery({
		queryKey: ['collections'],
		queryFn: async () => axios?.get('/collection').then((res) => res.data),
	});

	return query;
};
