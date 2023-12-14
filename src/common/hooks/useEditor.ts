import React from 'react';
import { useParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import { useEditPreInvocationMutation } from '@/common/api/invocations';

const useEditor = (preInvocation: string) => {
	const [editorValue, setEditorValue] = React.useState<string>(preInvocation);
	const { mutate: editInvocation } = useEditPreInvocationMutation();
	const { invocationId } = useParams();

	const preInvocationValue = useDebouncedCallback(() => {
		editInvocation({ id: invocationId ?? '', preInvocation: editorValue });
	}, 700);

	React.useEffect(() => {
		if (editorValue || editorValue === '') {
			preInvocationValue();
		}
	}, [editorValue, preInvocationValue]);

	return { editorValue, setEditorValue };
};

export default useEditor;
