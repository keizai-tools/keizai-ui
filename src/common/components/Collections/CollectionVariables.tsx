/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseMutateFunction } from '@tanstack/react-query';
import { PlusIcon, Trash2 } from 'lucide-react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
	useForm,
	useFieldArray,
	Control,
	UseFieldArrayRemove,
	Controller,
} from 'react-hook-form';
import { useParams } from 'react-router-dom';

// import { useDebounce } from 'use-debounce';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

import {
	useCreateEnvironmentMutation,
	useDeleteEnvironmentMutation,
	useEditEnvironmentMutation,
	useEnvironmentsQuery,
} from '@/common/api/enviroments';
import { Environment } from '@/common/types/environment';

interface IEnviromentItem {
	index: number;
	enviroment: Environment;
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

function EnvironmentItem({
	enviroment,
	index,
	collectionId,
	control,
	removeItem,
	deleteMutation,
}: IEnviromentItem) {
	const [name, setName] = useState<string>(enviroment.name);
	const [value, setValue] = useState<string>(enviroment.value);

	// const [debouncedName] = useDebounce(name, 1000);
	// const [debouncedValue] = useDebounce(value, 1000);

	const { mutate: editEnviromentMutation } = useEditEnvironmentMutation({
		collectionId,
	});

	const generateMutationData = (field: string, value: string) => {
		const mutationData =
			field === 'name'
				? {
						id: enviroment.id,
						name: value,
						value: enviroment.value,
						collectionId,
				  }
				: { id: enviroment.id, name: enviroment.name, value, collectionId };

		editEnviromentMutation(mutationData);
	};

	return (
		<li
			key={index}
			className="flex flex-row items-center gap-2 pb-2"
			data-test="collection-variables-input-list"
		>
			<Controller
				render={({ field: nameField }) => (
					<Input
						placeholder="Name"
						className="w-1/3"
						data-test="collection-variables-input-name"
						{...nameField}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							nameField.onChange(e.target.value);
							setName(e.target.value);
							generateMutationData(nameField.name, name);
						}}
					/>
				)}
				name={`environments.${index}.name`}
				control={control}
			/>
			<Controller
				render={({ field: valueField }) => (
					<Input
						placeholder="Value"
						className="w-2/3"
						data-test="collection-variables-input-value"
						{...valueField}
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							valueField.onChange(e.target.value);
							setValue(e.target.value);
							generateMutationData(valueField.name, value);
						}}
					/>
				)}
				name={`environments.${index}.value`}
				control={control}
			/>
			<button
				type="button"
				className="font-semibold"
				onClick={() => {
					enviroment.id ? deleteMutation(enviroment.id) : removeItem(index);
				}}
			>
				<Trash2 className="w-6 h-6 cursor-pointer text-slate-500 hover:text-primary" />
			</button>
		</li>
	);
}

export default function CollectionVariables() {
	const params = useParams();
	const collectionId = useMemo(() => {
		return params.collectionId ? params.collectionId : '';
	}, [params]);

	const { data: environmentsData, isLoading } = useEnvironmentsQuery({
		collectionId,
	});
	const { mutate: deleteEnvironmentMutation } = useDeleteEnvironmentMutation({
		collectionId,
	});
	const { mutate: createEnviromentMutation } = useCreateEnvironmentMutation({
		collectionId,
	});

	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			environments: [] as Environment[],
		},
	});

	const variablesList = useMemo(() => {
		return environmentsData ? environmentsData : [];
	}, [environmentsData]);
	console.log('variablesList', '\n', variablesList);

	useEffect(() => {
		if (!isLoading) {
			reset({
				environments: variablesList,
			});
		}
	}, [environmentsData, isLoading, reset, variablesList]);

	const { fields, append, remove } = useFieldArray({
		keyName: 'key',
		control,
		name: 'environments',
	});
	console.log('fields', '\n', fields);
	const addNewInputVariable = () => {
		append({
			id: '',
			name: '',
			value: '',
		});
	};

	const onSubmit = (data: { environments: Environment[] | undefined }) => {
		const { environments } = data;

		if (environments) {
			environments.forEach((environment) => {
				if (!environment.id && environment.name && environment.value) {
					// console.log(`createEnviromentMutation(name: ${environment.name},
					// 	value: ${environment.value},
					// 	collectionId: ${collectionId})`);
					createEnviromentMutation({
						name: environment.name,
						value: environment.value,
						collectionId,
					});
				}
			});
		}
	};

	if (isLoading) {
		return 'Loading...' as any;
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="border-t py-8 px-6 h-[400px] w-full"
			data-test="collection-variables-container"
		>
			<header className="flex justify-between mr-8">
				<div>
					<h1
						className="text-3xl font-semibold text-primary"
						data-test="collection-variables-title"
					>
						Collections variables
					</h1>
					<p className="px-2 text-sm font-semibold text-slate-500">
						Collection Name
					</p>
				</div>
				<div>
					<Button
						type="button"
						className="font-semibold"
						onClick={addNewInputVariable}
					>
						<PlusIcon size={12} className="mr-2" />
						Add new
					</Button>
				</div>
			</header>
			<ul
				className="flex flex-col gap-2 px-1 pt-12"
				data-test="collection-variables-input-container"
			>
				{variablesList &&
					variablesList.length > 0 &&
					fields.map((enviroment, index) => (
						<EnvironmentItem
							key={index}
							enviroment={enviroment}
							index={index}
							collectionId={collectionId}
							control={control}
							removeItem={remove}
							deleteMutation={deleteEnvironmentMutation}
						/>
					))}
			</ul>
			<div className="flex justify-end pt-4 mr-8">
				<Button type="submit" className="font-semibold">
					Save
				</Button>
			</div>
		</form>
	);
}
