import { Code } from 'lucide-react';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '../ui/accordion';
import { Button } from '../ui/button';

const contractInvocations = [
	'Get current counter',
	'Increase counter',
	'Decrease counter',
];

const Collections = () => {
	return (
		<div
			className="w-[300px] flex-col border-r dark:border-r-border h-full px-3 py-1"
			data-test="collections-container"
		>
			<div
				className="flex items-center  justify-between"
				data-test="collections-header"
			>
				<h4 className="text-lg font-bold" data-test="collections-header-title">
					Collections
				</h4>
				<div className="">
					<Button
						variant="secondary"
						className="text-xs px-2 py-1 h-auto "
						data-test="collections-header-btn-new"
					>
						New
					</Button>
					<Button
						variant="link"
						className="p-2 text-foreground"
						data-test="collections-header-btn-import"
					>
						Import
					</Button>
				</div>
			</div>
			<Accordion
				type="multiple"
				className="w-full"
				defaultValue={['folder-id']}
				data-test="collections-accordion-container"
			>
				<AccordionItem value="folder-id" className="border-none">
					<AccordionTrigger>Basic use case</AccordionTrigger>
					<AccordionContent>
						<div className="flex flex-col gap-2 ml-5">
							{contractInvocations.map((invocation) => (
								<div key={invocation} className="flex items-center gap-1">
									<Code height={16} className="text-neutral-500" />
									<Button variant="link" className="p-0 h-auto text-foreground">
										{invocation}
									</Button>
								</div>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default Collections;
