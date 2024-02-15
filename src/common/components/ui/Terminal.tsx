import React from 'react';

import { useResize } from '@/common/hooks/useResize';

export type TerminalEntry = {
	preInvocation?: React.ReactNode;
	postInvocation?: React.ReactNode;
	title?: React.ReactNode;
	message: string;
	isError: boolean;
};

const Terminal = ({ entries }: { entries: TerminalEntry[] }) => {
	const terminalRef = React.useRef<HTMLDivElement>(null);
	const containerRef = React.useRef<HTMLDivElement>(null);
	const resizeTopRef = React.useRef<HTMLDivElement>(null);
	const { onResizeCrossAxis } = useResize();

	React.useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [entries.length]);

	React.useEffect(() => {
		const resizeableEle = containerRef.current;
		const resizerTop = resizeTopRef.current;

		if (resizeableEle && resizerTop) {
			onResizeCrossAxis(resizeableEle, resizerTop);
		}
	}, [onResizeCrossAxis]);

	return (
		<div
			className="absolute mx-3 inset-x-0 bottom-0 bg-background z-40"
			data-test="terminal-container"
			ref={containerRef}
		>
			<div
				className="h-0.5 w-full border-t-2 dark:border-t-border border-zinc-600 cursor-ns-resize pb-4"
				data-test="terminal-border-resize"
				ref={resizeTopRef}
			></div>
			<div
				className="mx-2 pb-4 text-zinc-600 h-full overflow-y-auto scrollbar scrollbar-thumb-slate-700 scrollbar-w-2 scrollbar-thumb-rounded"
				data-test="terminal-scrollbar-container"
			>
				<span className="font-bold">Welcome to keizai 1.0.0 - OUTPUT</span>
				<div
					ref={terminalRef}
					className="flex flex-col gap-4 py-5"
					data-test="terminal-entry-container"
				>
					{entries.map((entry, index) => (
						<div
							key={index}
							className={`flex flex-col gap-1 text-sm text-zinc-200 ${
								entry.isError ? 'border-red-500' : 'border-green-700'
							} border-l-2 pl-2`}
							data-test="terminal-entry-title"
						>
							{entry.preInvocation}
							{entry.title}
							<span className="ml-4" data-test="terminal-entry-message">
								{entry.isError
									? entry.message
									: JSON.stringify(entry.message, null, 2)}
							</span>
							{entry.postInvocation}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Terminal;
