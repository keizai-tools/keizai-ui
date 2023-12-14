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
	const [hoveredEnvironment, setHoveredEnvironment] =
		React.useState<string>('');
	return (
		<div
			className="dropdown-menu absolute bg-background text-white border w-80 max-h-64 rounded mt-0.5 mx-2 flex"
			data-test="dropdown-environments-container"
		>
			<ul
				className="overflow-hidden overflow-y-scroll w-2/5 scrollbar scrollbar-w-2 scrollbar-h-1 scrollbar-track-background scrollbar-thumb-slate-700 scrollbar-thumb-rounded"
				data-test="dropdown-environments-ul-container"
			>
				{environments?.map((env: Environment) => (
					<li
						key={env.id}
						id={env.id}
						data-test="dropdown-enviroment-li-container"
						className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 border-b-[1px] border-r-[1px] text-xs"
						onMouseEnter={() => setHoveredEnvironment(env.value)}
						onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
							handleSelect(e.currentTarget.id, index, setValue);
						}}
					>
						{env.name}
					</li>
				))}
			</ul>
			<div className="w-3/5 p-4 text-xs flex gap-4 border-l-[1px]">
				<span className="text-slate-400">VALUE</span>
				<span
					className="overflow-y-hidden break-all"
					data-test="dropdown-hover-enviroment-value"
				>
					{hoveredEnvironment}
				</span>
			</div>
		</div>
	);
}
