import React from 'react';
import { useParams } from 'react-router-dom';

import { useEditNetworkMutation } from '../api/invocations';

function useNetwork(defaultNetwork: string) {
	const [selectNetwork, setSelectNetwork] = React.useState(defaultNetwork);
	const { mutate } = useEditNetworkMutation();
	const params = useParams();

	const handleUpdateNetwork = async (network: string) => {
		await mutate({
			network,
			id: params.invocationId as string,
		});
	};

	return { selectNetwork, setSelectNetwork, handleUpdateNetwork };
}

export default useNetwork;
