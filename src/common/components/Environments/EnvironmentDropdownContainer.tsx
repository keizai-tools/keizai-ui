import React from 'react';

import EnvironmentDropdown from './EnvironmentDropdown';

import useEnvironments from '@/common/hooks/useEnvironments';
import { Environment } from '@/common/types/environment';

type IProps = {
	children: React.ReactNode;
	showEnvironments: boolean;
	handleSelect: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

function EnvironmentDropdownContainer({
	children,
	handleSelect,
	showEnvironments,
}: IProps) {
	const { environments } = useEnvironments();

	return (
		<div id="dropdown" className="z-10 divide-slate-800 rounded w-full">
			{children}
			{showEnvironments && (
				<EnvironmentDropdown
					environments={environments as Environment[]}
					handleSelect={handleSelect}
				/>
			)}
		</div>
	);
}

export default EnvironmentDropdownContainer;
