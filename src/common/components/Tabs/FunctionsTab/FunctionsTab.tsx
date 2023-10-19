import { Controller, useFieldArray, useForm } from 'react-hook-form';

import FunctionParameterInput from '../../Input/FunctionParameter';
import { Button } from '../../ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../ui/select';

export type FunctionForm = {
	functionName: string;
	parameters: {
		id: string;
		key: string;
		value: string;
	}[];
};

const FunctionsTab = () => {
	const {
		handleSubmit,
		control,
		formState: { isDirty },
	} = useForm<FunctionForm>({
		defaultValues: {
			functionName: '',
			parameters: [],
		},
	});
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'parameters',
	});

	return (
		<form onSubmit={handleSubmit(console.log)}>
			{/* eslint-disable-next-line no-constant-condition */}
			{false ? (
				<div className="flex flex-col gap-2 mt-7">
					<span className="text-primary text-md font-semibold">
						Function to invoke
					</span>
					<Controller
						control={control}
						name="functionName"
						render={({ field }) => (
							<Select {...field} onValueChange={field.onChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select function" />
								</SelectTrigger>
								<SelectContent>
									{[]?.map((functionName) => (
										<SelectItem key={functionName} value={functionName}>
											{functionName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					<div className="flex flex-col mt-5 ">
						<div className="flex justify-between">
							<span className="text-primary text-md font-semibold">
								Function parameters
							</span>
							<Button
								onClick={() => append({ id: '', key: '', value: '' })}
								size="icon"
								className="rounded-full h-[24px] p-0"
								type="button"
							>
								<span className="text-sm">Add</span>
							</Button>
						</div>
						{(fields?.length ?? 0) > 0 ? (
							<div className="flex flex-col gap-2 py-3">
								{fields.map((field, index) => (
									<FunctionParameterInput
										key={field.id}
										control={control}
										index={index}
										onDelete={() => remove(index)}
									/>
								))}
							</div>
						) : (
							<div className="flex justify-center">
								<span className="text-slate-400">
									Add your first parameter!
								</span>
							</div>
						)}
					</div>
					{/* TODO Replace this button with autosave */}
					{isDirty && (
						<Button className="ml-auto mt-10 w-fit">
							Save function and parameters
						</Button>
					)}
				</div>
			) : (
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
			)}
		</form>
	);
};

export default FunctionsTab;
