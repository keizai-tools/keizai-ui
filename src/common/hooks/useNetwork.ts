import React from 'react';
import { useParams } from 'react-router-dom';

import { useEditNetworkMutation } from '../api/invocations';
import useContractEvents from './useContractEvents';

function useNetwork(defaultNetwork: string) {
	const [selectNetwork, setSelectNetwork] = React.useState(defaultNetwork);
	const { teamId, invocationId } = useParams();
	const { mutate } = useEditNetworkMutation(teamId);
	const { removeEventsFromStorage } = useContractEvents();

	const handleUpdateNetwork = async (network: string) => {
		await mutate({
			network,
			id: invocationId as string,
		});
		removeEventsFromStorage(invocationId as string);
	};

	return { selectNetwork, setSelectNetwork, handleUpdateNetwork };
}

export default useNetwork;
