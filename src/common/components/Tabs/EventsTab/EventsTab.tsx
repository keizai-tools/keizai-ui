import { Copy } from 'lucide-react';
import React from 'react';

const eventExample = {
	jsonrpc: '2.0',
	id: 8675309,
	result: {
		events: [
			{
				type: 'contract',
				ledger: 2531021,
				ledgerClosedAt: '2023-11-15T08:58:25Z',
				contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
				id: '0010870652420501504-0000000004',
				pagingToken: '0010870652420501504-0000000004',
				topic: [
					'AAAADwAAAAh0cmFuc2Zlcg==',
					'AAAAEgAAAAAAAAAAjt5DlR5mhneFx/1Lct0ToW555OFzg/Y28++28cJXU+I=',
					'AAAAEgAAAAAAAAAA33Fu/fnobL8/u8tyLCIZzpMXbsRWRBlfAuEv7fBvTwM=',
					'AAAADgAAAAZuYXRpdmUAAA==',
				],
				value: {
					xdr: 'AAAACgAAAAAAAAAAAAAAAAAAAJY=',
				},
				inSuccessfulContractCall: true,
			},
			{
				type: 'contract',
				ledger: 2531273,
				ledgerClosedAt: '2023-11-15T09:20:38Z',
				contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
				id: '0010871734752280576-0000000004',
				pagingToken: '0010871734752280576-0000000004',
				topic: [
					'AAAADwAAAAh0cmFuc2Zlcg==',
					'AAAAEgAAAAAAAAAA+YQ+FM83vUUwQ6P3gKCMVTyC3/jO+DERXTWJDKEjagU=',
					'AAAAEgAAAAAAAAAAwl0UMLLKYqMEedoowz8VnwbRywjcKEeQegoMmU6C9/0=',
					'AAAADgAAAAZuYXRpdmUAAA==',
				],
				value: {
					xdr: 'AAAACgAAAAAAAAAAAAAAAAAAAJY=',
				},
				inSuccessfulContractCall: true,
			},
		],
		latestLedger: 2539388,
	},
};

function EventsTab() {
	const stringifyEvent = JSON.stringify(eventExample, null, 2);
	const [isCopied, setIsCopied] = React.useState<boolean>(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(stringifyEvent);
		setIsCopied(true);

		setTimeout(() => {
			setIsCopied(false);
		}, 1000);
	};

	return (
		<section
			className="w-full h-[500px] overflow-hidden overflow-y-auto scrollbar scrollbar-w-2 scrollbar-h-1 scrollbar-track-background scrollbar-thumb-slate-700 scrollbar-thumb-rounded"
			data-test="events-tab-container"
		>
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
		</section>
	);
}

export default EventsTab;
