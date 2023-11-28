import React from 'react';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import { useEditPreInvocationMutation } from '@/common/api/invocations';

const useEditor = () => {
	const [editorValue, setEditorValue] = React.useState<string>();
	const { mutate: editInvocation } = useEditPreInvocationMutation();
	const [value] = useDebounce(editorValue, 1200);
	const params = useParams();
	React.useEffect(() => {
		if (value || value === '') {
			editInvocation({
				id: params.invocationId as string,
				preInvocation: value as string,
			});
		}
	}, [value, editInvocation, params.invocationId]);

	return { editorValue, setEditorValue };
};

export default useEditor;
