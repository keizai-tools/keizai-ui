import { Fragment } from 'react';

import EventCard from './EventCard';
import EventEmptyState from './EventEmptyState';

import useContractEvents from '@/common/hooks/useContractEvents';

function EventsTab() {
	const { contractEvents } = useContractEvents();

	return (
		<Fragment>
			{contractEvents.length > 0 ? (
				<section
					className="w-full h-full overflow-hidden overflow-y-auto scrollbar scrollbar-w-2 scrollbar-h-1 scrollbar-track-background scrollbar-thumb-slate-700 scrollbar-thumb-rounded"
					data-test="events-tab-container"
				>
					{contractEvents.map((event) => (
						<EventCard event={event} key={event.id} />
					))}
				</section>
			) : (
				<EventEmptyState />
			)}
		</Fragment>
	);
}

export default EventsTab;
