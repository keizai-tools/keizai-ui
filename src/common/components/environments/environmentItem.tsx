import { UseMutateFunction } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
	Control,
	Controller,
	FieldErrors,
	UseFieldArrayRemove,
	UseFormWatch,
} from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';

import ErrorMessage from '../form/errorMessage';
import { Input } from '../ui/input';

import { useEditEnvironmentMutation } from '@/common/api/environments';
import { ENVIRONMENTS_FORM } from '@/common/exceptions/environments';
import { Environment } from '@/common/types/environment';

interface IEnvironmentItem {
	index: number;
	environment: Environment;
	collectionId: string;
	control: Control<
		{
			environments: Environment[];
		},
		unknown
	>;
	errors: FieldErrors<{
		environments: Environment[];
	}>;
	watch: UseFormWatch<{
		environments: Environment[];
	}>;
	removeItem: UseFieldArrayRemove;
	deleteMutation: UseMutateFunction<
		unknown,
		Error,
		string,
		{
			oldEnvs: Environment[] | undefined;
		}
	>;
}

interface ISetValue {
	value: string;
	field: string;
}

export default function EnvironmentItem({
	environment,
	index,
	collectionId,
	control,
	watch,
	errors,
	removeItem,
	deleteMutation,
}: Readonly<IEnvironmentItem>) {
	const [inputValue, setInputValue] = useState<ISetValue>({
		value: '',
		field: '',
	});

	const { mutate: editEnvironmentMutation } = useEditEnvironmentMutation({
		collectionId,
	});

	const debounced = useDebouncedCallback((field: string, value: string) => {
		const shortFieldName = field.split('.').pop();
		if (shortFieldName && environment.id) {
			const mutationData =
				shortFieldName === 'name'
					? {
							id: environment.id,
							name: value,
							value: environment.value,
							collectionId,
					  }
					: { id: environment.id, name: environment.name, value, collectionId };
			editEnvironmentMutation(mutationData);
		}
	}, 700);

	useEffect(() => {
		const { value, field } = inputValue;
		debounced(field, value);
	}, [inputValue, debounced]);

	const inputRules = {
		name: {
			validate: (name: string) => {
				if (name === '') return ENVIRONMENTS_FORM.NAME_EMPTY;
				const environments = watch('environments').filter(
					(_env, envIndex) => envIndex !== index,
				);
				const nameExist = environments.some(
					(environment) => environment.name === name,
				);
				if (nameExist) return ENVIRONMENTS_FORM.NAME_ALREADY_EXISTS;
			},
		},
		value: {
			validate: (value: string) => {
				if (value === '') return ENVIRONMENTS_FORM.VALUE_EMPTY;
			},
		},
	};

	return (
		<li
			key={index}
			className="flex flex-row gap-2 pb-2"
			data-test="collection-variables-input-container"
		>
			<div className="flex flex-col w-1/3">
				<Controller
					name={`environments.${index}.name`}
					control={control}
					rules={inputRules.name}
					render={({ field: nameField }) => (
						<Input
							placeholder="Name"
							className={`${
								!environment.id && errors.environments?.[index]?.name
									? 'border-red-500'
									: ''
							}`}
							data-test="collection-variables-input-name"
							{...nameField}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								nameField.onChange(e.target.value);
								setInputValue({ value: e.target.value, field: nameField.name });
							}}
						/>
					)}
				/>
				{!environment.id && errors.environments?.[index]?.name && (
					<ErrorMessage
						message={errors.environments?.[index]?.name?.message as string}
						testName="collection-variables-input-name-error"
						styles="text-xs"
					/>
				)}
			</div>
			<div className="flex flex-col w-2/3">
				<Controller
					name={`environments.${index}.value`}
					control={control}
					rules={inputRules.value}
					render={({ field: valueField }) => (
						<Input
							{...valueField}
							placeholder="Value"
							className={`${
								errors.environments?.[index]?.value ? 'border-red-500' : ''
							}`}
							data-test="collection-variables-input-value"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								valueField.onChange(e.target.value);
								setInputValue({
									value: e.target.value,
									field: valueField.name,
								});
							}}
						/>
					)}
				/>
				{!environment.id && errors.environments?.[index]?.value && (
					<ErrorMessage
						message={errors.environments?.[index]?.value?.message as string}
						testName="collection-variables-input-value-error"
						styles="text-xs"
					/>
				)}
			</div>
			<button
				type="button"
				data-test="collection-variables-btn-delete"
				className={`font-semibold ${
					errors.environments?.[index] ? 'mt-2 self-baseline' : ''
				}`}
				onClick={() => {
					environment.id ? deleteMutation(environment.id) : removeItem(index);
				}}
			>
				<Trash2 className="w-6 h-6 cursor-pointer text-slate-500 hover:text-primary" />
			</button>
		</li>
	);
}
