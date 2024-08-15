import React from 'react';
import { useParams } from 'react-router-dom';

import { useEditNetworkMutation } from '../api/invocations';
import useContractEvents from './useContractEvents';

function useNetwork(defaultNetwork: string) {
	const [selectNetwork, setSelectNetwork] = React.useState(defaultNetwork);
	const { mutate } = useEditNetworkMutation();
	const { removeEventsFromStorage } = useContractEvents();
	const params = useParams();

	function handleUpdateNetwork(network: string) {
		mutate({
			network,
			id: params.invocationId as string,
		});
		removeEventsFromStorage(params.invocationId as string);
	}

	return { selectNetwork, setSelectNetwork, handleUpdateNetwork };
}

export default useNetwork;
