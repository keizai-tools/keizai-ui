import React from 'react';
import { useParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import { useEditPreInvocationMutation } from '@/common/api/invocations';

function useEditor(preInvocation: string, postInvocation: string) {
  const [preInvocationEditorValue, setPreInvocationEditorValue] =
    React.useState<string>(preInvocation);
  const [postInvocationEditorValue, setPostInvocationEditorValue] =
    React.useState<string>(postInvocation);
  const { mutate: editInvocation } = useEditPreInvocationMutation();
  const { invocationId } = useParams();

  const preInvocationValue = useDebouncedCallback(() => {
    preInvocation !== preInvocationEditorValue &&
      editInvocation({
        id: invocationId ?? '',
        preInvocation: preInvocationEditorValue,
      });
  }, 700);

  const postInvocationValue = useDebouncedCallback(() => {
    postInvocation !== postInvocationEditorValue &&
      editInvocation({
        id: invocationId ?? '',
        postInvocation: postInvocationEditorValue,
      });
  }, 700);

  React.useEffect(() => {
    if (preInvocationEditorValue || preInvocationEditorValue === '') {
      preInvocationValue();
    }
  }, [preInvocationEditorValue, preInvocationValue]);

  React.useEffect(() => {
    if (postInvocationEditorValue || postInvocationEditorValue === '') {
      postInvocationValue();
    }
  }, [postInvocationEditorValue, postInvocationValue]);

  return {
    preInvocationEditorValue,
    setPreInvocationEditorValue,
    postInvocationEditorValue,
    setPostInvocationEditorValue,
  };
}

export default useEditor;
