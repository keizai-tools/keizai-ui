import { OnChange } from '@monaco-editor/react';
import React from 'react';

import EnvironmentInput from '../Input/EnvironmentInput';
import EnvironmentDropdown from './EnvironmentDropdown';

import useEnvironments from '@/common/hooks/useEnvironments';
import { Environment } from '@/common/types/environment';

type IProps = {
	value: string;
	showEnvironments: boolean;
	styles: string;
	testName: string;
	placeholder: string;
	background: string;
	fontSize: number;
	handleChange: OnChange;
	handleSelectEnvironment: (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>,
	) => void;
};

function EnvironmentDropdownContainer({
	value,
	handleChange,
	styles,
	testName,
	placeholder,
	background,
	fontSize,
	handleSelectEnvironment,
	showEnvironments,
}: IProps) {
	const { environments } = useEnvironments();

	return (
		<div id="dropdown" className="z-10 divide-slate-800 rounded shadow w-full">
			<div className={`flex items-center relative w-full ${styles}`}>
				{!value && (
					<span
						className="absolute left-0 top-[10px] text-sm text-slate-500 z-10 pointer-events-none px-3"
						data-test="environment-input-placeholder"
					>
						{placeholder}
					</span>
				)}
				<EnvironmentInput
					value={value}
					handleChange={handleChange}
					background={background}
					fontSize={fontSize}
					testName={testName}
					data-test={testName}
				/>
			</div>
			{showEnvironments && (
				<EnvironmentDropdown
					environments={environments as Environment[]}
					handleSelect={handleSelectEnvironment}
				/>
			)}
		</div>
	);
}

export default EnvironmentDropdownContainer;
