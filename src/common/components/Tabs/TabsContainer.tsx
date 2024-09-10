import { Button } from '../ui/button';
import EventsTab from './EventsTab/EventsTab';
import FunctionsTab from './FunctionsTab/FunctionsTab';
import PreInvocationTab from './PreInvocationTab/PreInvocationTab';
import TestsTab from './TestsTab/TestsTab';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/common/components/ui/tabs';
import useEditor from '@/common/hooks/useEditor';
import { Invocation } from '@/common/types/invocation';

const tabs: Record<string, string> = {
  functions: 'Functions',
  preInvocateScript: 'Pre-invocate script',
  tests: 'Tests',
  events: 'Events tracker',
};

type TabsProps = {
  data: Invocation;
  preInvocationValue: string;
  postInvocationValue: string;
  setIsTerminalVisible: (value: React.SetStateAction<boolean>) => void;
};

function TabsContainer({
  data,
  preInvocationValue,
  postInvocationValue,
  setIsTerminalVisible,
}: Readonly<TabsProps>) {
  const { setPreInvocationEditorValue, setPostInvocationEditorValue } =
    useEditor(preInvocationValue, postInvocationValue);

  return (
    <Tabs
      defaultValue="functions"
      className="flex flex-col w-full h-full"
      data-test="tabs-container"
    >
      <div>
        <TabsList className="py-3 h-11" data-test="tabs-list-container">
          {Object.keys(tabs).map((tab) => {
            return (
              <TabsTrigger
                key={tab}
                value={tab}
                data-test={`functions-tabs-${tab}`}
              >
                {tabs[tab]}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <Button
          className="w-auto px-8 py-3 mx-2 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          variant="outline"
          onClick={() => setIsTerminalVisible((prev) => !prev)}
          data-test="functions-tabs-console"
        >
          Console
        </Button>
      </div>
      <TabsContent value="functions" className="h-full">
        <FunctionsTab
          invocationId={data.id}
          methods={data.methods}
          selectedMethod={data.selectedMethod}
        />
      </TabsContent>
      <TabsContent value="preInvocateScript" className="h-full">
        <PreInvocationTab
          preInvocationValue={preInvocationValue}
          setPreInvocationValu={setPreInvocationEditorValue}
        />
      </TabsContent>
      <TabsContent value="tests" className="h-full">
        <TestsTab
          testsInvocationValue={postInvocationValue}
          setTestsInvocationValue={setPostInvocationEditorValue}
        />
      </TabsContent>
      <TabsContent value="events" className="h-full">
        <EventsTab />
      </TabsContent>
    </Tabs>
  );
}

export default TabsContainer;
