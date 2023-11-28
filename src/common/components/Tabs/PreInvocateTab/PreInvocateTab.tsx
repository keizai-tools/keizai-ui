import loader from '@monaco-editor/loader';
import { useEffect } from 'react';

import Editor from '../../PreInvocate/Editor';

const extraLib = `declare const Keizai: {};`;

function PreInvocateTab({
	setEditorValue,
	preInvocation,
}: {
	setEditorValue: (value?: string | undefined) => void;
	preInvocation?: string;
}) {
	useEffect(() => {
		const initEditor = async () => {
			const monaco = await loader.init();

			monaco.languages.typescript.javascriptDefaults.addExtraLib(extraLib);
		};
		initEditor();
	}, []);

	return (
		<div className="w-full h-full h-[500px]" id="editor">
			<Editor setEditorValue={setEditorValue} defaultValue={preInvocation} />
		</div>
	);
}

export default PreInvocateTab;
