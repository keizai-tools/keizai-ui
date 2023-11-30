import { Dispatch, SetStateAction } from 'react';

import {
	editorHelpers,
	editorHelpersDescriptions,
} from '@/common/constants/editor-helpers';
import { Keizai } from '@/common/constants/keizai';

function EditorHelpers({
	setEditorValue,
}: {
	setEditorValue: Dispatch<SetStateAction<string>>;
}) {
	return (
		<div className="m-2 p-4">
			<p className="text-sm text-gray-400">
				Pre invocations are written in Javascript, and are run before the
				invocation.
			</p>
			<div className="my-6">
				<p className="text-gray-500 underline">Snippets</p>
				<ul className="text-sm text-gray-400 list-disc">
					{editorHelpers.map((helper, index) => (
						<li
							key={index}
							className="text-sm text-slate-500 hover:text-blue-600 my-5 cursor-pointer"
							data-test={`editor-helper-${helper}`}
							onClick={() => setEditorValue((prev) => prev + Keizai[helper])}
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
