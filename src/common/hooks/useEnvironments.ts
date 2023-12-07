import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { useEnvironmentsQuery } from '../api/enviroments';
import { ParametersFormType } from '../components/Tabs/FunctionsTab/ParametersForm';
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
			setValue(
				`parameters.${index}.value`,
				paramValue + `{{${environment.name}}}`,
				{
					shouldDirty: true,
				},
			);
			setParamValue((prevValue) => prevValue + `{{${environment.name}}}`);
			setShowEnvironments(false);
		}
	};

	const handleSearchEnvironment = (newSearchEnvironment: string) => {
		setShowEnvironments(newSearchEnvironment.endsWith('{'));
		setParamValue(newSearchEnvironment);
	};

	return {
		environments,
		showEnvironments,
		selectEnvironment,
		handleSearchEnvironment,
		handleSelectEnvironment,
	};
}
