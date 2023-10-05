import Collections from '@/common/components/Collections/Collections';

export default function Home() {
	return (
		<main
			className="flex flex-col flex-1  justify-between"
			data-test="home-page-container"
		>
			<Collections />
		</main>
	);
}
