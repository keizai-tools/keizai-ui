import EventCard from './EventCard';
import EventEmptyState from './EventEmptyState';

import useContractEvents from '@/common/hooks/useContractEvents';

function EventsTab() {
	const { contractEvents } = useContractEvents();

	return (
		<>
			{contractEvents.length > 0 ? (
				<section
					className="w-full h-[500px] overflow-hidden overflow-y-auto scrollbar scrollbar-w-2 scrollbar-h-1 scrollbar-track-background scrollbar-thumb-slate-700 scrollbar-thumb-rounded"
					data-test="events-tab-container"
				>
					{contractEvents.map((event) => (
						<EventCard event={event} key={event.id} />
					))}
				</section>
			) : (
				<EventEmptyState />
			)}
		</>
	);
}

export default EventsTab;
