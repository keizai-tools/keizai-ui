import React from 'react';

export type TerminalEntry = {
	preInvocation?: React.ReactNode;
	postInvocation?: React.ReactNode;
	title?: React.ReactNode;
	message: string;
	isError: boolean;
};

const Terminal = ({ entries }: { entries: TerminalEntry[] }) => {
	const terminalRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [entries.length]);

	return (
		<div
			className="h-[300px] border-t-2 px-1 py-4 text-zinc-600 dark:border-t-border"
			data-test="terminal-container"
		>
			<span className="font-bold">Welcome to keizai 1.0.0 - OUTPUT</span>

			<div
				ref={terminalRef}
				className="flex flex-col h-full gap-4 py-5 overflow-auto"
			>
				{entries.map((entry, index) => (
					<div
						key={index}
						className={`flex flex-col gap-1 text-sm text-zinc-200 ${
							entry.isError ? 'border-red-500' : 'border-green-700'
						} border-l-2 pl-2`}
					>
						{entry.preInvocation}
						{entry.title}
						<span className="ml-4">
							{entry.isError
								? entry.message
								: JSON.stringify(entry.message, null, 2)}
						</span>
						{entry.postInvocation}
					</div>
				))}
			</div>
		</div>
	);
};

export default Terminal;
