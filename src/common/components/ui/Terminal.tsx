import React from 'react';

import { Button } from './button';

import { useResize } from '@/common/hooks/useResize';
import { generateUniqueID } from '@/utils/functions/generateUniqueID';

export type TerminalEntry = {
  preInvocation?: React.ReactNode;
  postInvocation?: React.ReactNode;
  title: React.ReactNode;
  message: React.ReactNode | string;
  isError: boolean;
  invocationId?: string;
};

interface TerminalProps {
  entries: TerminalEntry[];
  onClear?: () => void;
  showClearButton?: boolean;
}

function Terminal({
  entries,
  onClear,
  showClearButton = false,
}: TerminalProps) {
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const resizeTopRef = React.useRef<HTMLDivElement>(null);
  const { onResizeCrossAxis } = useResize();

  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [entries.length]);

  React.useEffect(() => {
    const resizeableEle = containerRef.current;
    const resizerTop = resizeTopRef.current;

    if (resizeableEle && resizerTop) {
      onResizeCrossAxis(resizeableEle, resizerTop);
    }
  }, [onResizeCrossAxis]);

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 mx-3 bg-background"
      data-test="terminal-container"
      ref={containerRef}
    >
      <div
        className="h-0.5 w-full border-t-2 dark:border-t-border border-zinc-600 cursor-ns-resize pb-4"
        data-test="terminal-border-resize"
        ref={resizeTopRef}
      ></div>
      <div
        className="h-full pb-4 mx-2 overflow-y-auto text-zinc-600 scrollbar scrollbar-thumb-slate-700 scrollbar-w-2 scrollbar-thumb-rounded"
        data-test="terminal-scrollbar-container"
      >
        <div className="flex justify-between items-center pb-4">
          <span className="font-bold">Welcome to keizai 1.0.0 - OUTPUT</span>
          {showClearButton && (
            <Button
              className="w-auto px-8 py-3 font-bold transition-all duration-300 ease-in-out transform border-2 shadow-md hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={onClear}
            >
              Clear Console
            </Button>
          )}
        </div>
        <div
          ref={terminalRef}
          className="flex flex-col gap-4 py-5"
          data-test="terminal-entry-container"
        >
          {entries
            .slice()
            .reverse()
            .map((entry) => (
              <div
                key={generateUniqueID()}
                className={`flex flex-col gap-1 text-sm text-zinc-200 ${
                  entry.isError ? 'border-red-500' : 'border-green-700'
                } border-l-2 pl-2`}
                data-test="terminal-entry-title"
              >
                {entry.invocationId && (
                  <div className="text-xs text-gray-500">
                    Invocation ID: {entry.invocationId}
                  </div>
                )}
                {entry.preInvocation}
                {entry.title}
                <span className="ml-4" data-test="terminal-entry-message">
                  {entry.isError
                    ? entry.message instanceof String ||
                      typeof entry.message === 'string'
                      ? entry.message
                          ?.split('\n')
                          .map((line, index) => <div key={index}>{line}</div>)
                      : entry.message
                    : JSON.stringify(entry.message, null, 2)}
                </span>
                {entry.postInvocation}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Terminal;
