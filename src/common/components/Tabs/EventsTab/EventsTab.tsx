import EventCard from './EventCard';
import EventEmptyState from './EventEmptyState';

import { EventResponse } from '@/common/types/contract-events';

function EventsTab({ events }: { events: EventResponse[] }) {
	return (
		<section
			className="w-full h-[500px] overflow-hidden overflow-y-auto scrollbar scrollbar-w-2 scrollbar-h-1 scrollbar-track-background scrollbar-thumb-slate-700 scrollbar-thumb-rounded"
			data-test="events-tab-container"
		>
			{events.length > 0 ? (
				events.map((event) => <EventCard event={event} key={event.id} />)
			) : (
				<EventEmptyState />
			)}
		</section>
	);
}

export default EventsTab;
