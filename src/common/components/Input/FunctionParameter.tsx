/* eslint-disable prettier/prettier */
import { DeleteIcon } from 'lucide-react';
import React from 'react';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';

import EnvironmentInputContainer from '../Environments/EnvironmentDropdownContainer';
import { ParametersFormType } from '../Tabs/FunctionsTab/ParametersForm';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import useEnvironments from '@/common/hooks/useEnvironments';
import { useParameters } from '@/common/hooks/useParameters';
import { SCSpecTypeMap, isKeyOfSCSpecTypeMap } from '@/common/types/invocation';

const FunctionParameterInput = ({
	control,
	index,
	onDelete,
	defaultParameters,
	setValue,
	defaultValue,
}: {
	control: Control<ParametersFormType>;
	index: number;
	onDelete?: () => void;
	setValue: UseFormSetValue<ParametersFormType>;
	defaultParameters: {
		name: string;
		type: string;
	}[];
	defaultValue: string;
}) => {
	const { showEnvironments, handleSelectEnvironment, handleSearchEnvironment } =
		useEnvironments();
	const { setParamValue, paramValue } = useParameters({ defaultValue });
	const valueRef = React.useRef<HTMLInputElement>(null);
	const getTypeByParameterName = (parameterName: string) => {
		return defaultParameters.find(
			(parameter) => parameter.name === parameterName,
		)?.type;
	};
	React.useEffect(() => {
		if (paramValue !== '') {
			setValue(`parameters.${index}.value`, paramValue, {
				shouldDirty: true,
			});
		}
	}, [index, paramValue, setValue]);

	const handleSelect = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		const environmentValue = handleSelectEnvironment(e.currentTarget.id);

		if (environmentValue) {
			setParamValue((prev) => prev + `{${environmentValue}}}`);
		}
	};

	const onHandleChange = (value: string | undefined) => {
		handleSearchEnvironment(value ?? '');
		setParamValue(value ?? '');
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
						<EnvironmentInputContainer
							value={valueField.value}
							handleChange={onHandleChange}
							handleSelectEnvironment={handleSelect}
							showEnvironments={showEnvironments}
							styles="h-10 rounded-md border border-input"
							placeholder="Parameter value"
							background={'#020817'}
							fontSize={14}
							testName="function-tab-parameter-input-value"
						/>
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
