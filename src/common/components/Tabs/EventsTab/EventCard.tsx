import { Copy } from 'lucide-react';
import React from 'react';

import { EventResponse } from '@/common/types/contract-events';

function EventCard({ event }: Readonly<{ event: EventResponse }>) {
	const [isCopied, setIsCopied] = React.useState<boolean>(false);
	const stringifyEvent = JSON.stringify(event, null, 2);

	function copyToClipboard() {
		navigator.clipboard.writeText(stringifyEvent);
		setIsCopied(true);

		setTimeout(() => {
			setIsCopied(false);
		}, 1000);
	}

	return (
		<div
			className="w-[99%] mt-4 p-4 border border-slate-800 rounded"
			data-test="events-tab-event-container"
		>
			<div className="flex justify-between mb-4 h-9">
				<h2 data-test="events-tab-event-title">Event</h2>
				<div className="flex flex-row items-center gap-2">
					{isCopied && (
						<span
							className="p-2 text-xs border rounded bg-background text-primary"
							data-test="events-tab-copy-tooltip"
						>
							Copied!
						</span>
					)}
					<Copy
						className="cursor-pointer hover:text-primary"
						onClick={copyToClipboard}
						data-test="events-tab-btn-copy"
					/>
				</div>
			</div>
			<pre
				className="text-xs text-slate-300"
				data-test="events-tab-event-content"
			>
				{stringifyEvent}
			</pre>
		</div>
	);
}

export default EventCard;
