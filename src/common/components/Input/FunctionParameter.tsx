import { DeleteIcon } from 'lucide-react';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

import { FunctionForm } from '../Tabs/FunctionsTab/FunctionsTab';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const FunctionParameterInput = ({
	control,
	index,
	onDelete,
}: {
	control: Control<FunctionForm>;
	index: number;
	onDelete: () => void;
}) => {
	const keyRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (keyRef.current) {
			keyRef.current.focus();
		}
	}, []);

	return (
		<div className="flex gap-2 items-center">
			<Controller
				control={control}
				name={`parameters.${index}.key`}
				render={({ field }) => (
					<Input
						{...field}
						ref={keyRef}
						placeholder="Parameter key"
						type="text"
					/>
				)}
			/>
			<Controller
				control={control}
				name={`parameters.${index}.value`}
				render={({ field }) => (
					<Input {...field} placeholder="Parameter value" type="text" />
				)}
			/>

			<Button
				onClick={onDelete}
				variant={'ghost'}
				size={'icon'}
				className="min-w-[42px]"
			>
				<DeleteIcon size="20" className="text-primary" />
			</Button>
		</div>
	);
};

export default FunctionParameterInput;
