import loader from '@monaco-editor/loader';
import React, { useEffect } from 'react';

import Editor from '../../PreInvocate/Editor';

const extraLib = `declare const Keizai: {};`;

function PreInvocateTab({
	setPreInvocation,
	preInvocation,
}: {
	setPreInvocation: (value?: string | undefined) => void;
	preInvocation?: string;
}) {
	const [editorValue, setEditorValue] = React.useState<string>(
		preInvocation ?? '',
	);
	useEffect(() => {
		const initEditor = async () => {
			const monaco = await loader.init();

			monaco.languages.typescript.javascriptDefaults.addExtraLib(extraLib);
		};
		initEditor();
	}, []);

	return (
		<div className="w-full h-full h-[500px]" id="editor">
			<Editor
				setPreInvocation={setPreInvocation}
				defaultValue={preInvocation}
				setEditorValue={setEditorValue}
				editorValue={editorValue}
			/>
		</div>
	);
}

export default PreInvocateTab;
