import { Editor as MonacoEditor } from '@monaco-editor/react';
import { Dispatch, SetStateAction } from 'react';

import EditorHelpers from './EditorHelpers';

import {
  editorHelpers,
  editorHelpersDescriptions,
} from '@/common/constants/editor-helpers';

function PreInvocationEditor({
  editorValue,
  setEditorValue,
}: Readonly<{
  editorValue: string;
  setEditorValue: Dispatch<SetStateAction<string>>;
}>) {
  function handleEditorChange(value: string | undefined) {
    setEditorValue(value ?? '');
  }

  return (
    <div className="flex h-full">
      <MonacoEditor
        data-test="editor"
        defaultLanguage="javascript"
        onChange={handleEditorChange}
        theme="vs-dark"
        defaultValue={editorValue}
        value={editorValue}
      />
      <EditorHelpers
        setEditorValue={setEditorValue}
        title="Pre invocations are written in Javascript, and are run before the
				invocation."
        editorHelpers={editorHelpers}
        editorHelpersDescriptions={editorHelpersDescriptions}
      />
    </div>
  );
}

export default PreInvocationEditor;
