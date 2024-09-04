import { Fragment } from 'react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../ui/select';
import ParametersForm from './ParametersForm';

import { useEditSelectedMethodMutation } from '@/common/api/invocations';
import { Invocation } from '@/common/types/invocation';
import { cleanAndCapitalize } from '@/lib/utils';

interface FunctionsTabProps {
	invocationId: string;
	methods: Invocation['methods'];
	selectedMethod: Invocation['selectedMethod'];
}

const FunctionsTab = ({
	invocationId,
	methods,
	selectedMethod,
}: FunctionsTabProps) => {
	const { mutate: selectMethod } = useEditSelectedMethodMutation();

	return (
		<Fragment>
			<div
				className="flex flex-col gap-2 px-1 "
				data-test="tabs-function-container"
			>
				<span
					className="font-semibold text-primary text-md"
					data-test="tabs-function-title"
				>
					Function
				</span>

				<Select
					value={selectedMethod?.id ?? ''}
					onValueChange={(value) => {
						selectMethod({
							id: invocationId,
							selectedMethodId: value,
						});
						if (window.umami) window?.umami?.track('Select function');
					}}
				>
					<SelectTrigger data-test="tabs-function-select-container">
						<SelectValue
							placeholder="Select function"
							data-test="tabs-function-select-default"
						/>
					</SelectTrigger>
					<SelectContent>
						{methods?.map((method) => (
							<SelectItem
								key={method.id}
								value={method.id}
								data-test="tabs-function-select"
							>
								{cleanAndCapitalize(method.name)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<ParametersForm
					selectedMethodId={selectedMethod?.id}
					invocationId={invocationId}
				/>
			</div>
		</Fragment>
	);
};

export default FunctionsTab;
