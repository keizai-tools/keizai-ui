import React from 'react';

export const useParameters = ({ defaultValue }: { defaultValue: string }) => {
	const [paramValue, setParamValue] = React.useState<string>(defaultValue);

	const addEnvironmentToParamValue = (value: string) => {
		setParamValue((prev) => prev + `{${value}}}`);
	};

	return { paramValue, addEnvironmentToParamValue, setParamValue };
};
