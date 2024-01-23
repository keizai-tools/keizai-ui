/* eslint-disable prettier/prettier */
import { DeleteIcon } from 'lucide-react';
import React from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';

import EnvironmentDropdownContainer from '../Environments/EnvironmentDropdownContainer';
import { ParametersFormType } from '../Tabs/FunctionsTab/ParametersForm';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import useEnvironments from '@/common/hooks/useEnvironments';
import { SCSpecTypeMap, isKeyOfSCSpecTypeMap } from '@/common/types/invocation';

const FunctionParameterInput = ({
	control,
	index,
	onDelete,
	setValue,
	defaultParameters,
}: {
	control: Control<ParametersFormType>;
	index: number;
	onDelete?: () => void;
	setValue: UseFormSetValue<ParametersFormType>;
	defaultParameters: {
		name: string;
		type: string;
	}[];
}) => {
	const {
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

	React.useEffect(() => {
		setValue(`parameters.${index}.value`, paramValue, {
			shouldDirty: true,
		});
	}, [index, paramValue, setValue]);

	const handleSelect = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		handleSelectEnvironment(e.currentTarget.id);
	};

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
				render={({ field: valueField }) => {
					return (
						<EnvironmentDropdownContainer
							handleSelect={handleSelect}
							showEnvironments={showEnvironments}
						>
							<Input
								{...valueField}
								ref={valueRef}
								placeholder="Parameter value"
								data-test="function-tab-parameter-input-value"
								autoComplete="off"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									handleSearchEnvironment(e.target.value);
									valueField.onChange(e);
								}}
							/>
						</EnvironmentDropdownContainer>
					);
				}}
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
