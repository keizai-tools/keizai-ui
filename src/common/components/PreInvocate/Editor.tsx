import { Editor as MonacoEditor } from '@monaco-editor/react';
import { Dispatch, SetStateAction } from 'react';

import EditorHelpers from './EditorHelpers';

function Editor({
	defaultValue,
	editorValue,
	setPreInvocation,
	setEditorValue,
}: {
	defaultValue?: string;
	editorValue: string;
	setPreInvocation: (value?: string | undefined) => void;
	setEditorValue: Dispatch<SetStateAction<string>>;
}) {
	function handleEditorChange(value: string | undefined) {
		setPreInvocation(value);
		setEditorValue(value ?? '');
	}

	return (
		<div className="flex h-full">
			<MonacoEditor
				data-test="editor"
				height={'100%'}
				width={'80%'}
				defaultLanguage="javascript"
				onChange={handleEditorChange}
				theme="vs-dark"
				defaultValue={defaultValue}
				value={editorValue}
			/>
			<EditorHelpers setEditorValue={setEditorValue} />
		</div>
	);
}

export default Editor;
