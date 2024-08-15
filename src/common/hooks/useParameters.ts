import React from 'react';

export function useParameters({ defaultValue }: { defaultValue: string }) {
	const [paramValue, setParamValue] = React.useState<string>(defaultValue);

	function addEnvironmentToParamValue(value: string) {
		setParamValue((prev) => prev + `{${value}}}`);
	}

	return { paramValue, addEnvironmentToParamValue, setParamValue };
}
