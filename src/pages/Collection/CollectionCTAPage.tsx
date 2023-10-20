const CollectionCTAPage = () => {
	return (
		<div className="flex items-center flex-wrap justify-center w-full h-fit gap-12 mt-48">
			<img
				src="/moon.svg"
				width={300}
				height={300}
				alt="No invocation selected"
			/>
			<div>
				<h1 className="text-2xl text-primary">
					Select an invocation from the sidebar
				</h1>
				<h3 className="text-xl text-slate-400">Or create a new one</h3>
			</div>
		</div>
	);
};

export default CollectionCTAPage;
