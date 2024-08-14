import { Dispatch, SetStateAction } from 'react';

import PreInvocationEditor from '../../preInvocate/preInvocationEditor';
import { customKeizaiToPreInvocationEditor } from '../editor/constant/customKeizaiEditor';
import { EditorTab } from '../editor/editorTab';

function PreInvocationTab({
	preInvocationValue,
	setPreInvocationValu,
}: Readonly<{
	preInvocationValue: string;
	setPreInvocationValu: Dispatch<SetStateAction<string>>;
}>) {
	return (
		<EditorTab customKeizaiEditor={customKeizaiToPreInvocationEditor}>
			<PreInvocationEditor
				setEditorValue={setPreInvocationValu}
				editorValue={preInvocationValue}
			/>
		</EditorTab>
	);
}

export default PreInvocationTab;
