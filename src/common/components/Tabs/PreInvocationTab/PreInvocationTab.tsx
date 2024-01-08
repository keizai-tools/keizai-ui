import { Dispatch, SetStateAction } from 'react';

import PreInvocationEditor from '../../PreInvocate/PreInvocationEditor';
import { EditorTab } from '../Editor/EditorTab';
import { customKeizaiToPreInvocationEditor } from '../Editor/constant/customKeizaiEditor';

function PreInvocationTab({
	preInvocationValue,
	setPreInvocationValu,
}: {
	preInvocationValue: string;
	setPreInvocationValu: Dispatch<SetStateAction<string>>;
}) {
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
