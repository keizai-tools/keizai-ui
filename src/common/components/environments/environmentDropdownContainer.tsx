import React, { useEffect, useRef, Dispatch, SetStateAction } from 'react';

import EnvironmentDropdown from './environmentDropdown';

import useEnvironments from '@/common/hooks/useEnvironments';

type IProps = {
	children: React.ReactNode;
	showEnvironments: boolean;
	handleSelect: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
	setShowEnvironments: Dispatch<SetStateAction<boolean>>;
};

function EnvironmentDropdownContainer({
	children,
	handleSelect,
	showEnvironments,
	setShowEnvironments,
}: Readonly<IProps>) {
	const { environments } = useEnvironments();
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
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
			className="w-full rounded divide-slate-800"
			ref={dropdownRef}
		>
			{children}
			{showEnvironments && (
				<EnvironmentDropdown
					environments={environments}
					handleSelect={handleSelect}
				/>
			)}
		</div>
	);
}

export default EnvironmentDropdownContainer;
