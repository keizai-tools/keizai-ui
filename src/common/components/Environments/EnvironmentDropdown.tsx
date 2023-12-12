import React from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { ParametersFormType } from '../Tabs/FunctionsTab/ParametersForm';

import { Environment } from '@/common/types/environment';

export default function EnvironmentDropdown({
	environments,
	handleSelect,
	index,
	setValue,
}: {
	environments: Environment[];
	handleSelect: (
		id: string,
		index: number,
		setValue: UseFormSetValue<ParametersFormType>,
	) => void;
	index: number;
	setValue: UseFormSetValue<ParametersFormType>;
}) {
	return (
		<ul
			className="dropdown-menu absolute text-white border w-44 rounded mt-0.5 mx-2"
			data-test="dropdown-environments-container"
		>
			{environments?.map((env: Environment) => (
				<li
					key={env.id}
					id={env.id}
					className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
					onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
						handleSelect(e.currentTarget.id, index, setValue);
					}}
				>
					{env.name}: {env.value}
				</li>
			))}
		</ul>
	);
}
