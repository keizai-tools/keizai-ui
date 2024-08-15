import { useQuery } from '@tanstack/react-query';

import { IApiResponse } from '@/config/axios/interfaces/IApiResponse';
import { apiService } from '@/config/axios/services/api.service';

export function useStatusNetworkQuery() {
	const query = useQuery<{
		futureNetwork: boolean;
		testNetwork: boolean;
		mainNetwork: boolean;
	}>({
		queryKey: ['futureNetwork', 'testNetwork', 'mainNetwork'],
		queryFn: async () =>
			apiService
				?.get<
					IApiResponse<{
						futureNetwork: boolean;
						testNetwork: boolean;
						mainNetwork: boolean;
					}>
				>('/system_status/soroban_network')
				.then((res) => {
					return res.payload;
				}),
	});
	return query;
}
