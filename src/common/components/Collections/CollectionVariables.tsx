import { PlusIcon, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

import {
	useDeleteEnvironmentMutation,
	useEnvironmentsQuery,
} from '@/common/api/enviroments';
import { Environment } from '@/common/types/environment';

export default function CollectionVariables() {
	const { data: environments } = useEnvironmentsQuery();
	const { mutate: deleteEnvironmentMutation } = useDeleteEnvironmentMutation();

	console.log('environments', '\n', environments);

	const variablesList = useMemo(() => {
		return environments;
	}, [environments]);

	const { control, handleSubmit } = useForm({
		defaultValues: {
			environments: variablesList as Environment[],
		},
	});
	console.log(control);

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

	// const onSubmit = (data: { environments: Environment[] }) => {
	// 	for (let i = 0; i <= data.environments.length; i++) {
	// 		if (
	// 			!data.environments[i].id &&
	// 			!data.environments[i].name &&
	// 			!data.environments[i].value
	// 		) {
	// 			console.log(
	// 				`se descarta esta posibilidad:`,
	// 				'\n',
	// 				data.environments[i],
	// 			);
	// 		} else if (data.environments[i].id) {
	// 			console.log(`Se actualiza:`, '\n', data.environments[i]);
	// 		}
	// 		console.log(
	// 			`Se crea una nueva variable con los datos:`,
	// 			'\n',
	// 			data.environments[i],
	// 		);
	// 	}
	// };

	const onSubmit = (data: { environments: Environment[] | undefined }) => {
		console.log('onSubmit data', '\n', data);
		console.log('onSubmit data', '\n', data);
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
				{fields.map((enviroment, index) => (
					<li
						key={enviroment.key}
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
