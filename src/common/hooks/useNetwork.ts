import { useParams } from 'react-router-dom';

import { useEditNetworkMutation } from '../api/invocations';
import useContractEvents from './useContractEvents';

function useNetwork(showToast = true) {
	const { mutate } = useEditNetworkMutation(showToast);
	const { removeEventsFromStorage } = useContractEvents();
	const params = useParams();

	function handleUpdateNetwork(network: string) {
		mutate({
			network,
			id: params.invocationId as string,
		});
		removeEventsFromStorage(params.invocationId as string);
	}

	return { handleUpdateNetwork };
}

export default useNetwork;
