import { PlusIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import EnvironmentItem from '../Environments/EnvironmentItem';
import { Button } from '../ui/button';

import { useCollectionsQuery } from '@/common/api/collections';
import {
	useCreateEnvironmentMutation,
	useDeleteEnvironmentMutation,
	useEnvironmentsQuery,
} from '@/common/api/enviroments';
import { Environment } from '@/common/types/environment';

export default function CollectionVariables() {
	const params = useParams();
	const { data: collections } = useCollectionsQuery();

	const collectionId = useMemo(() => {
		return params.collectionId ? params.collectionId : '';
	}, [params]);
	const collection = collections?.find((col) => col.id === collectionId);

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

	const { fields, append, remove } = useFieldArray({
		keyName: 'key',
		control,
		name: 'environments',
	});

	useEffect(() => {
		if (!isLoading) {
			reset({
				environments: variablesList,
			});
		}
	}, [environmentsData, isLoading, reset, variablesList]);

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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
					<p
						className="px-2 text-sm font-semibold text-slate-500"
						data-test="collection-variables-collection-name"
					>
						{collection?.name}
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
