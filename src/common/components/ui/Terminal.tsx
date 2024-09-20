import { PanelBottomClose, PanelBottomOpen } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from './button';

import { useResize } from '@/common/hooks/useResize';
import { generateUniqueID } from '@/utils/functions/generateUniqueID';

export type TerminalEntry = {
  preInvocation?: React.ReactNode;
  postInvocation?: React.ReactNode;
  title?: React.ReactNode;
  message: React.ReactNode | string;
  isError: boolean;
};

function Terminal({
  entries,
}: Readonly<{
  entries: TerminalEntry[];
}>) {
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
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

  function toggleTerminalVisibility(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'j') {
      event.preventDefault();
      setIsTerminalVisible((prev) => !prev);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', toggleTerminalVisibility);

    return () => {
      window.removeEventListener('keydown', toggleTerminalVisibility);
    };
  }, []);

  return (
    <>
      <div
        className={`absolute inset-x-0 bottom-0 z-40 mx-3 bg-background transition-transform duration-300 ease-in-out ${
          isTerminalVisible
            ? 'transform translate-y-0'
            : 'transform translate-y-full'
        }`}
        data-test="terminal-container"
        ref={containerRef}
        style={{ height: isTerminalVisible ? 'auto' : '0' }}
      >
        <div
          className="h-0.5 w-full border-t-2 dark:border-t-border border-zinc-600 cursor-ns-resize pb-4"
          data-test="terminal-border-resize"
          ref={resizeTopRef}
        ></div>
        <div
          className={`overflow-y-auto text-zinc-600 scrollbar scrollbar-thumb-slate-700 scrollbar-w-2 scrollbar-thumb-rounded transition-opacity duration-300 ease-in-out ${
            isTerminalVisible ? 'opacity-100' : 'opacity-0'
          }`}
          data-test="terminal-scrollbar-container"
          style={{ height: isTerminalVisible ? 'auto' : '0' }}
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              asChild
              onClick={() => setIsTerminalVisible(false)}
            >
              <PanelBottomClose className="p-2 text-white transition-colors duration-300 cursor-pointer hover:text-primary" />
            </Button>

            <span className="font-bold">Welcome to keizai 1.0.0 - OUTPUT</span>
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
                  {entry.preInvocation}
                  {entry.title}
                  <span className="ml-4" data-test="terminal-entry-message">
                    {entry.isError
                      ? typeof entry.message === 'string'
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
      {!isTerminalVisible && (
        <Button
          variant="outline"
          size="icon"
          asChild
          onClick={() => setIsTerminalVisible(true)}
        >
          <PanelBottomOpen className="p-2 text-white transition-colors duration-300 cursor-pointer hover:text-primary" />
        </Button>
      )}
    </>
  );
}

export default Terminal;
