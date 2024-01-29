import React from 'react';
import { useParams } from 'react-router-dom';

import { useEnvironmentsQuery } from '../api/enviroments';
import { Environment } from '../types/environment';

export default function useEnvironments() {
	const [environments, setEnvironments] = React.useState<Environment[]>([]);
	const [selectEnvironment, setSelectEnvironment] =
		React.useState<Environment | null>(null);
	const [showEnvironments, setShowEnvironments] =
		React.useState<boolean>(false);
	const { collectionId } = useParams();
	const { data, isLoading } = useEnvironmentsQuery({
		collectionId,
	});

	React.useEffect(() => {
		if (data) {
			setEnvironments(data);
		}
	}, [collectionId, data]);

	const handleSelectEnvironment = (id: string) => {
		const environment = environments?.find((env: Environment) => env.id === id);
		if (environment) {
			setSelectEnvironment(environment);
		}
		setShowEnvironments(false);

		return environment?.name;
	};

	const handleSearchEnvironment = (newSearchEnvironment: string) => {
		setShowEnvironments(newSearchEnvironment.endsWith('{'));
	};

	return {
		environments,
		isLoading,
		showEnvironments,
		selectEnvironment,
		handleSearchEnvironment,
		handleSelectEnvironment,
	};
}
