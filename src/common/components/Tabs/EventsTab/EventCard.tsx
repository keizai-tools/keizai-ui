import { Copy } from 'lucide-react';
import React from 'react';

import { EventResponse } from '@/common/types/contract-events';

function EventCard({ event }: { event: EventResponse }) {
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const stringifyEvent = JSON.stringify(event, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(stringifyEvent);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div
      className="w-[99%] mt-4 p-4 border border-slate-800 rounded"
      data-test="events-tab-event-container"
    >
      <div className="flex justify-between h-9 mb-4">
        <h2 data-test="events-tab-event-title">Event</h2>
        <div className="flex gap-2 flex-row items-center">
          {isCopied && (
            <span
              className="text-xs border p-2 rounded bg-background text-primary"
              data-test="events-tab-copy-tooltip"
            >
              Copied!
            </span>
          )}
          <Copy
            className="hover:text-primary cursor-pointer"
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
