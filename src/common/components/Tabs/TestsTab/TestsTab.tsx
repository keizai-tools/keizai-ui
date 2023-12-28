import loader from '@monaco-editor/loader';
import { Dispatch, SetStateAction, useEffect } from 'react';

import TestsEditor from '../../PostInvocation/TestsEditor';

const extraLib = `declare const Keizai: {};`;

function TestsTab({
	setPostInvocationValue,
	postInvocation,
}: {
	setPostInvocationValue: Dispatch<SetStateAction<string>>;
	postInvocation: string;
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
			<TestsEditor
				postInvocationValue={postInvocation}
				setPostInvocationValue={setPostInvocationValue}
			/>
		</div>
	);
}

export default TestsTab;
