import loader from '@monaco-editor/loader';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Fragment,
} from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { cleanAndCapitalize } from '@/lib/utils';

interface ThemeList {
  [key: string]: string;
}

export function EditorTab({
  children,
  customKeizaiEditor,
}: Readonly<{
  children: React.ReactNode;
  customKeizaiEditor: string;
}>) {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('editor-theme') ?? 'night-owl',
  );
  const [loadedThemes, setLoadedThemes] = useState<Record<string, boolean>>({
    vs: true,
    'vs-dark': true,
    'hc-black': true,
  });
  const [themeList, setThemeList] = useState<ThemeList>({});
  const [editorReady, setEditorReady] = useState<boolean>(false);
  const monacoRef = useRef<typeof monaco | null>(null);

  const onThemeChange = async (value: string) => {
    if (!loadedThemes[value]) {
      await loadTheme(value);
    }
    setTheme(value);
    localStorage.setItem('editor-theme', value);
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(value);
    }
  };

  const loadTheme = useCallback(
    async (value: string) => {
      if (loadedThemes[value]) return;

      const themePath = themeList[value];
      if (!themePath) return;

      try {
        const response = await fetch(`/themes/${themePath}.json`);
        if (!response.ok) throw new Error('Network response was not ok');
        const themeData = await response.json();

        if (monacoRef.current) {
          monacoRef.current.editor.defineTheme(value, themeData);
          setLoadedThemes((prev) => ({ ...prev, [value]: true }));
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    },
    [themeList, loadedThemes],
  );

  const initializeEditor = useCallback(async () => {
    if (editorReady) return;
    const response = await fetch('/themes/themelist.json');
    const data: ThemeList = await response.json();
    setThemeList(data);

    self.MonacoEnvironment = {
      getWorker(_, label) {
        return label === 'typescript' || label === 'javascript'
          ? new tsWorker()
          : new editorWorker();
      },
    };

    const loadedMonaco = await loader.init();
    monacoRef.current = loadedMonaco;
    monacoRef.current.languages.typescript.javascriptDefaults.addExtraLib(
      customKeizaiEditor,
      'keizai.d.ts',
    );

    const storedThemeName = localStorage.getItem('editor-theme') ?? 'night-owl';
    await loadTheme(storedThemeName);
    monacoRef.current.editor.setTheme(storedThemeName);
    setEditorReady(true);
  }, [customKeizaiEditor, loadTheme, editorReady]);

  useEffect(() => {
    initializeEditor();
  }, [initializeEditor]);

  return (
    <Fragment>
      <Select value={theme} onValueChange={onThemeChange}>
        <SelectTrigger className="w-[20%] gap-2 px-4 py-3 mb-2 font-bold border-2 rounded-md shadow-md border-slate-900 text-slate-400 focus:outline-none focus:ring-0 ring-0 focus-visible:ring-0 focus:ring-transparent">
          <SelectValue
            aria-label={theme}
            className="flex items-center justify-between"
          >
            {cleanAndCapitalize(theme)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-full p-1 overflow-hidden rounded-md shadow-lg scrollbar h-36 ring-1 ring-black ring-opacity-5 scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {Object.keys(themeList).map((key) => (
            <SelectItem
              key={key}
              value={key}
              className="transition-colors duration-200 cursor-pointer text-slate-700"
            >
              {cleanAndCapitalize(key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="w-full h-[95%] rounded-2xl" id="editor">
        {children}
      </div>
    </Fragment>
  );
}
