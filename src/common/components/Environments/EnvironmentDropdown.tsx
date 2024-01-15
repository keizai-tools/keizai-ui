import React from 'react';
import { UseFormSetValue } from 'react-hook-form';

import { ParametersFormType } from '../Tabs/FunctionsTab/ParametersForm';
import EnvironmentEmptyState from './EnvironmentEmptyState';
import EnvironmentList from './EnvironmentList';

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

	const handleSelectEnvironment = (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>,
	) => {
		handleSelect(e.currentTarget.id, index, setValue);
	};

	return (
		<div
			className="dropdown-menu absolute bg-background text-white border w-96 max-h-64 rounded mt-0.5 mx-2 flex"
			data-test="dropdown-environments-container"
		>
			{environments.length > 0 ? (
				<EnvironmentList
					environments={environments}
					hoveredEnvironment={hoveredEnvironment}
					setHoveredEnvironment={setHoveredEnvironment}
					handleSelectEnvironment={handleSelectEnvironment}
				/>
			) : (
				<EnvironmentEmptyState
					styles="py-2 text-xs"
					testName="dropdown-enviroments-empty-state"
				/>
			)}
		</div>
	);
}
