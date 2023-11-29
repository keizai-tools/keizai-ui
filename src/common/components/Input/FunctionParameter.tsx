import { DeleteIcon } from 'lucide-react';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

import { ParametersFormType } from '../Tabs/FunctionsTab/ParametersForm';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import useEnvironments from '@/common/hooks/useEnvironments';
import { Environment } from '@/common/types/environment';
import { SCSpecTypeMap, isKeyOfSCSpecTypeMap } from '@/common/types/invocation';

const FunctionParameterInput = ({
	control,
	index,
	onDelete,
	defaultParameters,
}: {
	control: Control<ParametersFormType>;
	index: number;
	onDelete?: () => void;
	defaultParameters: {
		name: string;
		type: string;
	}[];
}) => {
	const {
		environments,
		inputValue,
		paramValue,
		showEnvironments,
		handleSelectEnvironment,
		handleSearchEnvironment,
	} = useEnvironments();
	const valueRef = React.useRef<HTMLInputElement>(null);

	const getTypeByParameterName = (parameterName: string) => {
		return defaultParameters.find(
			(parameter) => parameter.name === parameterName,
		)?.type;
	};

	const newParamValue = React.useMemo(() => {
		return paramValue;
	}, [paramValue]);

	React.useEffect(() => {
		if (valueRef.current) {
			valueRef.current.focus();
		}
	}, []);

	return (
		<div className="flex gap-2 items-center">
			<Controller
				control={control}
				name={`parameters.${index}.name`}
				render={({ field }) => {
					const parameterType = getTypeByParameterName(field.value);
					return (
						<div className="relative min-w-[250px]">
							<Input {...field} placeholder="Parameter key" type="text" />
							{parameterType && isKeyOfSCSpecTypeMap(parameterType) && (
								<span className="absolute right-3 top-[10px] text-sm text-slate-500 z-auto pointer-events-none">
									{SCSpecTypeMap[parameterType]}
								</span>
							)}
						</div>
					);
				}}
			/>
			<Controller
				control={control}
				name={`parameters.${index}.value`}
				render={({ field: valueField }) => (
					<>
						<Input
							{...valueField}
							ref={valueRef}
							placeholder="Parameter value"
							type="text"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								handleSearchEnvironment(e.target.value, valueField.onChange);
							}}
							value={inputValue}
						/>
						{showEnvironments && (
							<div
								id="dropdown"
								className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
							>
								<ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
									{environments?.map((env: Environment) => (
										<li
											key={env.id}
											id={env.id}
											className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
											onClick={(
												e: React.MouseEvent<HTMLLIElement, MouseEvent>,
											) => {
												handleSelectEnvironment(e.currentTarget.id);
												valueField.onChange(newParamValue);
											}}
										>
											{env.name}: {env.value}
										</li>
									))}
								</ul>
							</div>
						)}
					</>
				)}
			/>

			{onDelete && (
				<Button
					onClick={onDelete}
					variant={'ghost'}
					size={'icon'}
					className="min-w-[42px]"
				>
					<DeleteIcon size="20" className="text-primary" />
				</Button>
			)}
		</div>
	);
};

export default FunctionParameterInput;
