import loader from '@monaco-editor/loader';
import React from 'react';

export function EditorTab({
	children,
	customKeizaiEditor,
}: {
	children: React.ReactNode;
	customKeizaiEditor: string;
}) {
	React.useEffect(() => {
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
