import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { useEnvironmentsQuery } from '../api/enviroments';
import { ParametersFormType } from '../components/Tabs/FunctionsTab/ParametersForm';
import { getParamValue } from '../helpers/environmentValue';
import { Environment } from '../types/environment';

export default function useEnvironments({
	index,
	setValue,
}: {
	index: number;
	setValue: UseFormSetValue<ParametersFormType>;
}) {
	const { collectionId } = useParams();
	const { data: environments } = useEnvironmentsQuery({
		collectionId,
	});

	const [selectEnvironment, setSelectEnvironment] =
		React.useState<Environment | null>(null);
	const [showEnvironments, setShowEnvironments] =
		React.useState<boolean>(false);
	const [paramValue, setParamValue] = React.useState<string>('');

	const handleSelectEnvironment = (id: string) => {
		const environment = environments?.find((env: Environment) => env.id === id);
		if (environment) {
			setSelectEnvironment(environment);
			setValue(`parameters.${index}.value`, `{{${environment.name}}}`, {
				shouldDirty: true,
			});
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
		setParamValue(getParamValue(newSearchEnvironment, environments));
	};

	return {
		environments,
		paramValue,
		showEnvironments,
		selectEnvironment,
		handleSearchEnvironment,
		handleSelectEnvironment,
	};
}
