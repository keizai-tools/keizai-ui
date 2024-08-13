interface NetworkStatusProps {
	name: string;
	isOperational: boolean;
}

function NetworkStatus({ name, isOperational }: NetworkStatusProps) {
	return (
		<div className="flex flex-col items-start justify-between w-full h-full gap-4 p-6 font-bold border-2 border-solid rounded-lg border-offset-background bg-slate-900">
			<div className="flex items-baseline justify-between w-full h-full">
				<p className="flex items-center text-lg pointer-events-none">{name}</p>
				<div
					className={`flex items-center gap-1 pointer-events-none ${
						isOperational ? 'text-green-400' : 'text-red-400'
					}`}
				>
					<span
						className={`w-2 h-2 rounded-full pointer-events-none ${
							isOperational ? 'bg-green-400' : 'bg-red-400'
						}`}
					/>
					{isOperational ? 'Operational' : 'Not Operational'}
				</div>
			</div>
		</div>
	);
}

export default NetworkStatus;
