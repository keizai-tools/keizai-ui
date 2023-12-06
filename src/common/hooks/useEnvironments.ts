import React from 'react';
import { useParams } from 'react-router-dom';

import { useEnvironmentsQuery } from '../api/enviroments';
import { getParamValue } from '../helpers/environmentValue';
import { Environment } from '../types/environment';

export default function useEnvironments() {
	const { collectionId } = useParams();
	const { data: environments } = useEnvironmentsQuery({
		collectionId,
	});

	const [selectEnvironment, setSelectEnvironment] =
		React.useState<Environment | null>(null);
	const [inputValue, setInputValue] = React.useState<string>('');
	const [showEnvironments, setShowEnvironments] =
		React.useState<boolean>(false);
	const [paramValue, setParamValue] = React.useState<string>('');

	const handleSelectEnvironment = (id: string) => {
		const environment = environments?.find((env: Environment) => env.id === id);
		if (environment) {
			setSelectEnvironment(environment);
			setInputValue((prevValue) =>
				prevValue
					? prevValue.slice(0, -1) + `{{${environment.name}}}`
					: `{${environment.name}}}`,
			);
			setParamValue((prevValue) =>
				prevValue
					? prevValue.slice(0, -1) + `${environment.value}`
					: `${environment.value}`,
			);
			setShowEnvironments(false);
		}
	};

	const handleSearchEnvironment = (newSearchEnvironment: string) => {
		setShowEnvironments(newSearchEnvironment.endsWith('{'));
		setInputValue(newSearchEnvironment);
		setParamValue(getParamValue(newSearchEnvironment, environments));
	};

	return {
		environments,
		inputValue,
		paramValue,
		showEnvironments,
		selectEnvironment,
		handleSearchEnvironment,
		handleSelectEnvironment,
	};
}
