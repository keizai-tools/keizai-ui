import loader from '@monaco-editor/loader';
import React from 'react';

interface Window {
	Cypress?: any; // don't really need strict type here
}

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

	if ((window as any).Cypress) {
		return <p>Mock</p>;
	}

	return (
		<div className="w-full h-full h-[500px]" id="editor">
			{children}
		</div>
	);
}
