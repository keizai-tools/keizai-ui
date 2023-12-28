function EventEmptyState() {
	return (
		<div className="flex my-20 px-12">
			<div
				className="flex justify-center items-center"
				data-test="events-tab-content-container"
			>
				<img
					src="/searching.svg"
					alt="Search events"
					width={300}
					height={300}
					loading="eager"
					data-test="events-tab-content-img"
				/>
				<div className="flex flex-col gap-3">
					<div
						className="flex flex-col justify-center text-primary font-black"
						data-test="events-tab-content-text"
					>
						<h2 className="text-4xl">Run the contract</h2>
						<h2 className="text-3xl">to see the events</h2>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EventEmptyState;
