import { PlusIcon, Trash2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

import {
	useCreateEnvironmentMutation,
	useDeleteEnvironmentMutation,
	useEnvironmentsQuery,
} from '@/common/api/enviroments';
import { Environment } from '@/common/types/environment';

export default function CollectionVariables() {
	const params = useParams();
	const { data: environmentsData, isLoading } = useEnvironmentsQuery();
	const { mutate: deleteEnvironmentMutation } = useDeleteEnvironmentMutation();
	const { mutate: createEnviromentMutation } = useCreateEnvironmentMutation();
	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			environments: [] as Environment[],
		},
	});

	const variablesList = useMemo(() => {
		return environmentsData ? environmentsData : [];
	}, [environmentsData]);
	console.log(variablesList);

	const collectionId = useMemo(() => {
		return params.collectionId ? params.collectionId : '';
	}, [params]);

	useEffect(() => {
		if (!isLoading) {
			reset({
				environments: variablesList,
			});
		}
	}, [environmentsData, isLoading, reset, variablesList]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'environments',
	});

	const addNewInputVariable = () => {
		append({
			id: collectionId,
			name: '',
			value: '',
		});
	};

	const onSubmit = (data: { environments: Environment[] | undefined }) => {
		const { environments } = data;

		if (environments) {
			environments.forEach((environment) => {
				createEnviromentMutation({
					name: environment.name,
					value: environment.value,
					collectionId,
				});
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
						<li
							key={index}
							className="flex flex-row items-center gap-2 pb-2"
							data-test="collection-variables-input-list"
						>
							<Controller
								render={({ field }) => (
									<Input
										placeholder="Name"
										className="w-1/3"
										data-test="collection-variables-input-name"
										{...field}
									/>
								)}
								name={`environments.${index}.name`}
								control={control}
							/>
							<Controller
								render={({ field }) => (
									<Input
										placeholder="Value"
										className="w-2/3"
										data-test="collection-variables-input-value"
										{...field}
									/>
								)}
								name={`environments.${index}.value`}
								control={control}
							/>
							<button
								type="button"
								className="font-semibold"
								onClick={
									enviroment.id
										? () => deleteEnvironmentMutation(enviroment.id)
										: () => remove(index)
								}
							>
								<Trash2 className="w-6 h-6 cursor-pointer text-slate-500 hover:text-primary" />
							</button>
						</li>
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
