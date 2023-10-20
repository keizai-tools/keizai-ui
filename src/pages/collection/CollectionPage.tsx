import Folders from '@/common/components/Folders/Folders';

const CollectionPage = () => {
	return (
		<main className="flex flex-1" data-test="collection-page-container">
			<Folders />
			<div className="flex items-center flex-wrap justify-center w-full gap-12">
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
		</main>
	);
};

export default CollectionPage;
