import { Dispatch, SetStateAction } from 'react';

import { KeizaiEditorValues } from '@/common/constants/editor/keizai';

function EditorHelpers({
	setEditorValue,
	title,
	editorHelpers,
	editorHelpersDescriptions,
}: Readonly<{
	setEditorValue: Dispatch<SetStateAction<string>>;
	title: string;
	editorHelpers: string[];
	editorHelpersDescriptions: Record<string, string>;
}>) {
	const handleChangeEditorValues = (value: string) => {
		setEditorValue((prev) => (prev ? `${prev}\n${value}` : value));
	};
	return (
		<div className="p-4 m-2">
			<p className="text-sm text-gray-400">{title}</p>
			<div className="my-6">
				<p className="text-gray-500 underline">Snippets</p>
				<ul className="text-sm text-gray-400 list-disc">
					{editorHelpers.map((helper, index) => (
						<li
							key={index}
							className="my-5 text-sm cursor-pointer text-slate-500 hover:text-blue-600"
							data-test={`editor-helper-${helper}`}
							onClick={() =>
								handleChangeEditorValues(KeizaiEditorValues[helper])
							}
						>
							{editorHelpersDescriptions[helper]}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default EditorHelpers;
