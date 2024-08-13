import React, { useState } from 'react';

import EnvironmentEmptyState from './EnvironmentEmptyState';
import EnvironmentList from './EnvironmentList';

import { Environment } from '@/common/types/environment';

export default function EnvironmentDropdown({
	environments,
	handleSelect,
}: Readonly<{
	environments: Environment[];
	handleSelect: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
}>) {
	const [hoveredEnvironment, setHoveredEnvironment] = useState<string>('');

	return (
		<div
			className="dropdown-menu absolute bg-background text-white border w-96 max-h-64 rounded mt-0.5 mx-2 flex shadow z-50"
			data-test="dropdown-environments-container"
		>
			{environments.length > 0 ? (
				<EnvironmentList
					environments={environments}
					hoveredEnvironment={hoveredEnvironment}
					setHoveredEnvironment={setHoveredEnvironment}
					handleSelectEnvironment={handleSelect}
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
