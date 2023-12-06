import React from 'react';

import { Environment } from '@/common/types/environment';

export default function EnvironmentDropdown({
	environments,
	handleSelect,
}: {
	environments: Environment[];
	paramValue: string;
	handleSelect: (id: string) => void;
	onChange: (value: string) => void;
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
						handleSelect(e.currentTarget.id);
					}}
				>
					{env.name}: {env.value}
				</li>
			))}
		</ul>
	);
}
