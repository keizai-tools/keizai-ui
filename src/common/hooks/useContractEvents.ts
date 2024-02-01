import React from 'react';
import { useParams } from 'react-router-dom';

import { EventResponse } from '../types/contract-events';

function useContractEvents() {
	const params = useParams();
	const [contractEvents, setContractEvents] = React.useState<EventResponse[]>(
		[],
	);

	React.useEffect(() => {
		const events =
			sessionStorage.getItem(`events-${params.invocationId}`) || '[]';
		setContractEvents(JSON.parse(events));
	}, [params.invocationId]);

	const handleSetContractEvents = (events: EventResponse[]) => {
		setContractEvents(events);
		sessionStorage.setItem(
			`events-${params.invocationId}`,
			JSON.stringify(events),
		);
	};

	const removeEventsFromStorage = (invocationId: string) => {
		sessionStorage.removeItem(`events-${invocationId}`);
		setContractEvents([]);
	};

	return { contractEvents, handleSetContractEvents, removeEventsFromStorage };
}

export default useContractEvents;
