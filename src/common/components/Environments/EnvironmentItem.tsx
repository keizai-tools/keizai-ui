/* eslint-disable @typescript-eslint/no-explicit-any */

import { UseMutateFunction } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '../ui/input';

import { useEditEnvironmentMutation } from '@/common/api/enviroments';
import { Environment } from '@/common/types/environment';

interface IEnvironmentItem {
	index: number;
	environment: Environment;
	collectionId: string;
	control: Control<
		{
			environments: Environment[];
		},
		any
	>;
	removeItem: UseFieldArrayRemove;
	deleteMutation: UseMutateFunction<
		any,
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
	removeItem,
	deleteMutation,
}: IEnvironmentItem) {
	const [inputValue, setInputValue] = React.useState<ISetValue>({
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

	React.useEffect(() => {
		const { value, field } = inputValue;
		debounced(field, value);
	}, [inputValue, debounced]);

	return (
		<li
			key={index}
			className="flex flex-row items-center gap-2 pb-2"
			data-test="collection-variables-input-container"
		>
			<Controller
				render={({ field: nameField }) => (
					<Input
						placeholder="Name"
						className="w-1/3"
						data-test="collection-variables-input-name"
						{...nameField}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							nameField.onChange(e.target.value);
							setInputValue({ value: e.target.value, field: nameField.name });
						}}
					/>
				)}
				name={`environments.${index}.name`}
				control={control}
			/>
			<Controller
				render={({ field: valueField }) => (
					<Input
						{...valueField}
						placeholder="Value"
						className="w-2/3"
						data-test="collection-variables-input-value"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							valueField.onChange(e.target.value);
							setInputValue({ value: e.target.value, field: valueField.name });
						}}
					/>
				)}
				name={`environments.${index}.value`}
				control={control}
			/>
			<button
				type="button"
				data-test="collection-variables-btn-delete"
				className="font-semibold"
				onClick={() => {
					environment.id ? deleteMutation(environment.id) : removeItem(index);
				}}
			>
				<Trash2 className="w-6 h-6 cursor-pointer text-slate-500 hover:text-primary" />
			</button>
		</li>
	);
}
