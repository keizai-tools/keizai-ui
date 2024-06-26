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

const FunctionsTab = ({
	invocationId,
	methods,
	selectedMethod,
}: {
	invocationId: string;
	methods: Invocation['methods'];
	selectedMethod: Invocation['selectedMethod'];
}) => {
	const { mutate: selectMethod } = useEditSelectedMethodMutation();

	return (
		<>
			{(methods?.length || 0) > 0 ? (
				<div
					className="flex flex-col gap-2 px-1 py-5"
					data-test="tabs-function-container"
				>
					<span
						className="text-primary text-md font-semibold"
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
							window.umami.track('Select function');
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
									{method.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<ParametersForm
						selectedMethodId={selectedMethod?.id}
						invocationId={invocationId}
					/>
				</div>
			) : (
				<div
					className="flex justify-center items-center my-24 flex-1 gap-8"
					data-test="tabs-content-container"
				>
					<img
						src="/moon.svg"
						alt="Load contract image"
						width={200}
						height={200}
						loading="eager"
						data-test="tabs-content-contract-img"
					/>
					<div className="flex flex-col gap-3">
						<div
							className="flex flex-col justify-center text-primary font-black text-6xl"
							data-test="tabs-content-contract-text"
						>
							<h2>Let&apos;s Load</h2>
							<h2>Your Contract.</h2>
						</div>
						<span
							className="text-xl text-slate-400"
							data-test="tabs-content-contract-description"
						>
							Input your contract address above to begin.
						</span>
					</div>
				</div>
			)}
		</>
	);
};

export default FunctionsTab;
