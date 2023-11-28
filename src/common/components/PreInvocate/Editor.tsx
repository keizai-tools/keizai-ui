import { Editor as MonacoEditor } from '@monaco-editor/react';

function Editor({
	setEditorValue,
	defaultValue,
}: {
	setEditorValue: (value?: string | undefined) => void;
	defaultValue?: string;
}) {
	function handleEditorChange(value: string | undefined) {
		setEditorValue(value);
	}
	return (
		<MonacoEditor
			data-test="editor"
			height={'100%'}
			width={'100%'}
			defaultLanguage="javascript"
			onChange={handleEditorChange}
			theme="vs-dark"
			defaultValue={defaultValue}
		/>
	);
}

export default Editor;
