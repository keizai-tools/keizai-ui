import { MessageSquarePlus } from 'lucide-react';

import { Button } from '@/common/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/common/components/ui/tooltip';

function FeedbackPopupButton() {
	return (
		<Tooltip delayDuration={100}>
			<TooltipTrigger asChild>
				<Button
					className="fixed z-50 rounded-full right-4 bottom-4"
					variant="secondary"
					data-tally-open="n0OjOQ"
					data-tally-overlay="1"
					data-tally-emoji-text="👋"
					data-tally-emoji-animation="wave"
				>
					<MessageSquarePlus />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p data-test="contract-input-btn-load-tooltip">Feedback & Bug report</p>
			</TooltipContent>
		</Tooltip>
	);
}

export default FeedbackPopupButton;
