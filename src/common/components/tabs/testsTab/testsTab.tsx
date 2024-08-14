import { Dispatch, SetStateAction } from 'react';

import TestsEditor from '../../postInvocation/testsEditor';
import { customKeizaiToTests } from '../editor/constant/customKeizaiEditor';
import { EditorTab } from '../editor/editorTab';

function TestsTab({
	testsInvocationValue,
	setTestsInvocationValue,
}: Readonly<{
	testsInvocationValue: string;
	setTestsInvocationValue: Dispatch<SetStateAction<string>>;
}>) {
	return (
		<EditorTab customKeizaiEditor={customKeizaiToTests}>
			<TestsEditor
				setPostInvocationValue={setTestsInvocationValue}
				postInvocationValue={testsInvocationValue}
			/>
		</EditorTab>
	);
}

export default TestsTab;
