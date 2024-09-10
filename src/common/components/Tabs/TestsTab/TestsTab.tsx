import { Dispatch, SetStateAction } from 'react';

import TestsEditor from '../../PostInvocation/TestsEditor';
import { EditorTab } from '../Editor/EditorTab';
import { customKeizaiToTests } from '../Editor/constant/customKeizaiEditor';

function TestsTab({
  testsInvocationValue,
  setTestsInvocationValue,
}: {
  testsInvocationValue: string;
  setTestsInvocationValue: Dispatch<SetStateAction<string>>;
}) {
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
