import Editor from 'react-simple-code-editor';

type EnvironmentInputProps = {
	value: string;
	placeholder: string;
	testName: string;
	styles?: string;
	handleChange: (value: string) => void;
};

function EnvironmentInput({
	value,
	placeholder,
	testName,
	styles,
	handleChange,
}: EnvironmentInputProps) {
	const environmentHighlight = (code: string) => {
		const envRegex = /{{[^{}]+}}/g;
		if (typeof code === 'string' && code !== '') {
			return code.replace(
				envRegex,
				(match) => `<span class="text-primary">${match}</span>`,
			);
		} else {
			return code;
		}
	};

	return (
		<Editor
			value={value}
			onValueChange={handleChange}
			highlight={(text) => environmentHighlight(text)}
			className={`${styles}`}
			padding={10}
			placeholder={placeholder}
			data-test={testName}
			ignoreTabKey={true}
			textareaClassName="focus:outline-none"
		/>
	);
}

export default EnvironmentInput;
