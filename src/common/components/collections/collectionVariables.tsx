import { PlusIcon } from 'lucide-react';
import { Fragment } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import EnvironmentEmptyState from '../environments/environmentEmptyState';
import EnvironmentItem from '../environments/environmentItem';
import { Button } from '../ui/button';

import {
	useDeleteEnvironmentMutation,
	useCreateAllEnvironmentsMutation,
} from '@/common/api/environments';
import { Collection } from '@/common/types/collection';
import { Environment } from '@/common/types/environment';

export function CollectionVariables({
	collection,
	collectionId,
	environments,
}: Readonly<{
	collectionId: string;
	collection: Collection | undefined;
	environments: Environment[];
}>) {
	const { mutate: deleteEnvironmentMutation } = useDeleteEnvironmentMutation({
		collectionId,
	});
	const { mutate: createEnvironmentsMutation } =
		useCreateAllEnvironmentsMutation({
			collectionId,
		});

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			environments,
		},
	});

	const { fields, append, remove } = useFieldArray({
		keyName: 'key',
		control,
		name: 'environments',
	});

	function addNewInputVariable() {
		append({
			id: '',
			name: '',
			value: '',
		});
	}

	function handleRemoveEnvironment(id: string) {
		reset({
			environments: fields.filter((field) => field.id !== id),
		});
		deleteEnvironmentMutation(id);
		window.umami.track('Delete collection variable');
	}

	function onSubmit(data: { environments: Environment[] | undefined }) {
		const environmentsToCreate = data.environments?.filter(
			(environment) => environment.id === '',
		);
		if (environmentsToCreate) {
			createEnvironmentsMutation(environmentsToCreate);
			window.umami.track('Save collection variables', {
				amount: environmentsToCreate.length,
			});
		}
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
						data-test="collection-variables-btn-add"
						onClick={addNewInputVariable}
					>
						<PlusIcon size={12} className="mr-2" />
						Add new
					</Button>
				</div>
			</header>
			{fields.length > 0 ? (
				<Fragment>
					<ul
						className="flex flex-col gap-2 px-1 pt-12"
						data-test="collection-variables-container"
					>
						{fields.map((environment) => (
							<EnvironmentItem
								key={environment.id}
								environment={environment}
								index={Number(environment.id)}
								collectionId={collectionId}
								control={control}
								watch={watch}
								errors={errors}
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
				</Fragment>
			) : (
				<EnvironmentEmptyState
					styles="py-8 text-base"
					testName="collection-variables-empty-state"
				/>
			)}
		</form>
	);
}
