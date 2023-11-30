import { PlusIcon } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

import EnvironmentItem from '../Environments/EnvironmentItem';
import { Button } from '../ui/button';

import {
	useCreateEnvironmentMutation,
	useDeleteEnvironmentMutation,
} from '@/common/api/enviroments';
import { Collection } from '@/common/types/collection';
import { Environment } from '@/common/types/environment';

export const CollectionVariables = ({
	collection,
	collectionId,
	environments,
}: {
	collectionId: string;
	collection: Collection | undefined;
	environments: Environment[];
}) => {
	const { mutate: deleteEnvironmentMutation } = useDeleteEnvironmentMutation({
		collectionId,
	});
	const { mutate: createEnviromentMutation } = useCreateEnvironmentMutation({
		collectionId,
	});

	const { control, handleSubmit, setValue } = useForm({
		defaultValues: {
			environments: environments as Environment[],
		},
	});

	const { fields, append, remove } = useFieldArray({
		keyName: 'key',
		control,
		name: 'environments',
	});

	const addNewInputVariable = () => {
		append({
			id: '',
			name: '',
			value: '',
		});
	};

	const handleRemoveEnvironment = (id: string) => {
		setValue(
			'environments',
			fields.filter((field) => field.id !== id),
		);
		deleteEnvironmentMutation(id);
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
						data-test="collection-variables-btn-add"
						onClick={addNewInputVariable}
					>
						<PlusIcon size={12} className="mr-2" />
						Add new
					</Button>
				</div>
			</header>
			<ul className="flex flex-col gap-2 px-1 pt-12">
				{fields.map((enviroment, index) => (
					<EnvironmentItem
						key={index}
						enviroment={enviroment}
						index={index}
						collectionId={collectionId}
						control={control}
						removeItem={remove}
						deleteMutation={handleRemoveEnvironment}
					/>
				))}
			</ul>
			<div className="flex justify-end pt-4 mr-8">
				<Button
					type="submit"
					className="font-semibold"
					data-test="collection-variables-btn-save"
				>
					Save
				</Button>
			</div>
		</form>
	);
};
