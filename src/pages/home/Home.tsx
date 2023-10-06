import Breadcrumb from '@/common/components/Breadcrumb/Breadcrumb';
import Collections from '@/common/components/Collections/Collections';
import ContractInput from '@/common/components/Input/ContractInput';
import Terminal from '@/common/components/ui/Terminal';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/common/components/ui/tabs';

const tabs: Record<string, string> = {
	functions: 'Functions',
	authorizations: 'Authorization',
	preInvocateScript: 'Pre-invocate script',
	tests: 'Tests',
	events: 'Events',
};

export default function Home() {
	return (
		<main className="flex flex-1" data-test="home-page-container">
			<Collections />
			<div className="flex flex-col justify-between w-full gap-7">
				<div className="flex flex-col p-3 w-full gap-7">
					<Breadcrumb
						contractName="Counter contract"
						folderName="Basic use case"
						contractInvocationName="Get current counter"
					/>
					<ContractInput />
					<Tabs
						defaultValue="functions"
						className=""
						data-test="tabs-container"
					>
						<TabsList className="" data-test="tabs-list-container">
							{Object.keys(tabs).map((tab) => (
								<TabsTrigger key={tab} value={tab} className="">
									{tabs[tab]}
								</TabsTrigger>
							))}
						</TabsList>
						<TabsContent value="functions">
							<div
								className="flex justify-center mt-36 flex-1 gap-8"
								data-test="tabs-content-container"
							>
								<img
									src="/moon.svg"
									alt="Load contract image"
									width={300}
									height={300}
									loading="eager"
									data-test="tabs-content-contract-img"
								/>
								<div
									className="flex flex-col justify-center text-primary font-black text-6xl"
									data-test="tabs-content-contract-text"
								>
									<h2>Let&apos;s Load</h2>
									<h2>Your Contract</h2>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
				<Terminal />
			</div>
		</main>
	);
}
