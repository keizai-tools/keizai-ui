import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { useEnvironmentsQuery } from '../api/enviroments';
import { ParametersFormType } from '../components/Tabs/FunctionsTab/ParametersForm';
import { Environment } from '../types/environment';

export default function useEnvironments() {
	const [environments, setEnvironments] = React.useState<Environment[]>([]);
	const { collectionId } = useParams();
	const { data, isLoading } = useEnvironmentsQuery({
		collectionId,
	});

	React.useEffect(() => {
		if (data) {
			setEnvironments(data);
		}
	}, [collectionId, data]);

	const [selectEnvironment, setSelectEnvironment] =
		React.useState<Environment | null>(null);
	const [showEnvironments, setShowEnvironments] =
		React.useState<boolean>(false);
	const [paramValue, setParamValue] = React.useState<string>('');

	const handleSelectEnvironmentWithForm = (
		id: string,
		index: number,
		setValue: UseFormSetValue<ParametersFormType>,
	) => {
		const environment = environments?.find((env: Environment) => env.id === id);
		if (environment) {
			setSelectEnvironment(environment);
			setValue(
				`parameters.${index}.value`,
				paramValue + `{${environment.name}}}`,
				{
					shouldDirty: true,
				},
			);
			setParamValue((prevValue) => prevValue + `{${environment.name}}}`);
			setShowEnvironments(false);
		}
	};

	const handleSelectEnvironment = (
		id: string,
		setValue: React.Dispatch<React.SetStateAction<string>>,
	) => {
		const environment = environments?.find((env: Environment) => env.id === id);
		if (environment) {
			setSelectEnvironment(environment);
			setValue(paramValue + `{${environment.name}}}`);
			setParamValue((prevValue) => prevValue + `{${environment.name}}}`);
			setShowEnvironments(false);
		}
	};

	const handleSearchEnvironment = (newSearchEnvironment: string) => {
		setShowEnvironments(newSearchEnvironment.endsWith('{'));
		setParamValue(newSearchEnvironment);
	};

	return {
		environments,
		isLoading,
		showEnvironments,
		selectEnvironment,
		handleSearchEnvironment,
		handleSelectEnvironment,
		handleSelectEnvironmentWithForm,
	};
}
