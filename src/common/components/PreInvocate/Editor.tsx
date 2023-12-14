import { Editor as MonacoEditor } from '@monaco-editor/react';
import { Dispatch, SetStateAction } from 'react';

import EditorHelpers from './EditorHelpers';

function Editor({
	editorValue,
	setEditorValue,
}: {
	editorValue: string;
	setEditorValue: Dispatch<SetStateAction<string>>;
}) {
	function handleEditorChange(value: string | undefined) {
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
				defaultValue={editorValue}
				value={editorValue}
			/>
			<EditorHelpers setEditorValue={setEditorValue} />
		</div>
	);
}

export default Editor;
