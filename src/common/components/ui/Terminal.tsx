import React from 'react';

const Terminal = ({ responses }: { responses: string[] }) => {
	const terminalRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [responses.length]);

	return (
		<div
			className="h-[300px] border-t-2 px-1 py-4 text-zinc-600 dark:border-t-border"
			data-test="terminal-container"
		>
			<span className="font-bold">Welcome to keizai 0.1.0 - OUTPUT</span>

			<div
				ref={terminalRef}
				className="flex flex-col h-full gap-4 py-5 overflow-auto"
			>
				{responses.map((response, index) => (
					<pre
						key={index}
						className="text-sm text-zinc-200 border-green-700 border-l-2 pl-2"
					>
						{JSON.stringify(response, null, 2)}
					</pre>
				))}
			</div>
		</div>
	);
};

export default Terminal;
