import debounce from 'lodash.debounce';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import FunctionParameterInput from '../../input/functionParameter';
import { Skeleton } from '../../ui/skeleton';

import {
	useEditParametersMethodMutation,
	useMethodQuery,
} from '@/common/api/methods';
import { Method, Parameter } from '@/common/types/method';

export type ParametersFormType = { parameters: Method['params'] };
function ParametersFormContent({
	data,
	invocationId,
}: Readonly<{
	data: Method;
	invocationId: string;
}>) {
	const { mutate: editParameters } = useEditParametersMethodMutation();
	const { control, watch, formState, reset, setValue } =
		useForm<ParametersFormType>({
			defaultValues: {
				parameters: data?.params,
			},
		});
	const { fields } = useFieldArray({
		control,
		name: 'parameters',
	});
	const watchFieldArray = watch('parameters');
	const controlledFields = fields.map((field, index) => {
		return {
			...field,
			...watchFieldArray[index],
		};
	});

	const debounceParams = React.useMemo(
		() =>
			debounce((value) => {
				editParameters({
					id: data.id,
					invocationId,
					parameters: value.map((param: Parameter) => ({
						name: param.name,
						value:
							isNaN(Number(param.value)) || !param.value
								? param.value
								: Number(param.value),
					})),
				});
				reset({
					parameters: value,
				});
			}, 500),
		[data.id, editParameters, invocationId, reset],
	);

	React.useEffect(() => {
		if (formState.dirtyFields.parameters) {
			debounceParams(watchFieldArray);
		}
	}, [debounceParams, formState.dirtyFields.parameters, watchFieldArray]);

	return (
		<div className="flex flex-col mt-5">
			<div className="flex justify-between">
				<span className="font-semibold text-primary text-md">Parameters</span>
			</div>
			{(controlledFields.length ?? 0) > 0 ? (
				<div className="flex flex-col gap-2 py-3">
					{controlledFields.map((field, index) => (
						<FunctionParameterInput
							key={field.name}
							defaultValue={field.value}
							index={index}
							control={control}
							setValue={setValue}
							defaultParameters={data.inputs ?? []}
						/>
					))}
				</div>
			) : (
				<div className="flex mt-3">
					<span className="text-xs text-slate-400">
						{data
							? 'No parameters for this function. '
							: 'Select a function to add parameters!'}
					</span>
				</div>
			)}
		</div>
	);
}

function ParametersForm({
	selectedMethodId,
	invocationId,
}: Readonly<{
	selectedMethodId?: string;
	invocationId: string;
}>) {
	const { data, isLoading } = useMethodQuery({
		id: selectedMethodId,
	});

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3 mt-5">
				<span className="font-semibold text-primary text-md">
					Function parameters
				</span>
				<Skeleton className="w-full h-[30px] rounded-xl" />
			</div>
		);
	}

	if (!data) {
		return null;
	}

	return (
		<ParametersFormContent
			key={data.id}
			data={data}
			invocationId={invocationId}
		/>
	);
}

export default ParametersForm;