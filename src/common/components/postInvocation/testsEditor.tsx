import { Editor as MonacoEditor } from '@monaco-editor/react';
import { Dispatch, SetStateAction } from 'react';

import EditorHelpers from '../preInvocate/editorHelpers';

import {
	editorTestsHelpers,
	editorTestsHelpersDescriptions,
} from '@/common/constants/editor-helpers';

function TestsEditor({
	postInvocationValue,
	setPostInvocationValue,
}: Readonly<{
	postInvocationValue: string;
	setPostInvocationValue: Dispatch<SetStateAction<string>>;
}>) {
	function handleEditorChange(value: string | undefined) {
		setPostInvocationValue(value ?? '');
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
				defaultValue={postInvocationValue}
				value={postInvocationValue}
			/>
			<EditorHelpers
				setEditorValue={setPostInvocationValue}
				title="	Post invocations are written in Javascript, and are run after the
				invocation."
				editorHelpers={editorTestsHelpers}
				editorHelpersDescriptions={editorTestsHelpersDescriptions}
			/>
		</div>
	);
}

export default TestsEditor;
