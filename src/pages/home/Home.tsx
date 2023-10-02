export default function Home() {
	return (
		<div className="flex items-center justify-center h-screen">
			{/* data-test? https://docs.cypress.io/guides/references/best-practices */}
			<h1 className="text-3xl font-bold underline" data-test="home-msg">
				This is the homepage!
			</h1>
		</div>
	);
}
