import { Environment } from '../types/environment';

const environmentRegex = /(\{\{[^{}]+\}\})/g;
const environmentReplace = /^{{([^{}]+)}}$/;

function findValueByName(
	name: string,
	environments?: Environment[],
): string | null {
	const environment = environments?.find((env) => env.name === name);
	return environment ? environment.value : null;
}

export function getParamValue(
	inputValues: string,
	environments?: Environment[],
): string {
	const values = inputValues.split(environmentRegex);
	let value = '';
	for (let i = 0; i < values.length; i++) {
		if (values[i] !== '' && !values[i].includes('}')) {
			value = value + values[i];
		} else if (values[i] !== '' && values[i].includes('}')) {
			const val = findValueByName(
				values[i].replace(environmentReplace, '$1'),
				environments,
			);
			value = value + val;
		}
	}
	return value;
}
