import {
	Monaco,
	Editor as MonacoEditor,
	OnChange,
	loader,
} from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import React from 'react';
import { PathString } from 'react-hook-form';

import { environmentsOptions } from '@/common/constants/editor-options';

type IProps = {
	value: string;
	background: PathString;
	fontSize: number;
	handleChange: OnChange;
	testName: string;
};

function EnvironmentInput({
	value,
	background,
	fontSize,
	handleChange,
	testName,
}: IProps) {
	React.useEffect(() => {
		const initEnvironmentInput = async () => {
			const monaco = await loader.init();

			monaco.editor.defineTheme('environments', {
				base: 'vs-dark',
				inherit: true,
				rules: [{ token: 'environment', foreground: '3DDBF0' }],
				colors: {
					'editor.background': background,
				},
			});
			monaco.editor.setTheme('environments');
			monaco.languages.register({ id: 'plaintext' });

			monaco.languages.setMonarchTokensProvider('plaintext', {
				tokenizer: {
					root: [[/{{[^{}]+}}/, 'environment']],
				},
			});
		};
		initEnvironmentInput();
	}, [background]);

	const handleEditorDidMount = (
		editor: monaco.editor.IStandaloneCodeEditor,
		monaco: Monaco,
	) => {
		editor.updateOptions({ fontSize });

		editor.onKeyDown((e) => {
			if (e.keyCode === monaco.KeyCode.Enter) {
				e.preventDefault();
			}
		});
	};

	return (
		<MonacoEditor
			className={testName}
			height={'60%'}
			width={'97%'}
			loading={null}
			theme="environments"
			defaultLanguage="plaintext"
			value={value}
			onChange={handleChange}
			onMount={handleEditorDidMount}
			options={environmentsOptions}
		/>
	);
}

export default EnvironmentInput;
