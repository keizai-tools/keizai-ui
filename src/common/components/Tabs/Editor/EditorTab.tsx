import loader from '@monaco-editor/loader';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import React from 'react';

export function EditorTab({
	children,
	customKeizaiEditor,
}: {
	children: React.ReactNode;
	customKeizaiEditor: string;
}) {
	React.useEffect(() => {
		self.MonacoEnvironment = {
			getWorker(_, label) {
				if (label === 'typescript' || label === 'javascript') {
					return new tsWorker();
				}
				return new editorWorker();
			},
		};

		const initEditor = async () => {
			const monaco = await loader.init();

			monaco.languages.typescript.javascriptDefaults.addExtraLib(
				customKeizaiEditor,
				'keizai.d.ts',
			);
		};
		initEditor();
	}, [customKeizaiEditor]);

	return (
		<div className="w-full h-full h-[500px]" id="editor">
			{children}
		</div>
	);
}
