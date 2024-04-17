import React from 'react';

import EnvironmentDropdown from './EnvironmentDropdown';

import useEnvironments from '@/common/hooks/useEnvironments';
import { Environment } from '@/common/types/environment';

type IProps = {
	children: React.ReactNode;
	showEnvironments: boolean;
	handleSelect: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
	setShowEnvironments: React.Dispatch<React.SetStateAction<boolean>>;
};

function EnvironmentDropdownContainer({
	children,
	handleSelect,
	showEnvironments,
	setShowEnvironments,
}: IProps) {
	const { environments } = useEnvironments();
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowEnvironments(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [setShowEnvironments, showEnvironments]);

	return (
		<div
			id="dropdown"
			className="divide-slate-800 rounded w-full"
			ref={dropdownRef}
		>
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
