import * as monaco from 'monaco-editor';

export const environmentsOptions: monaco.editor.IStandaloneEditorConstructionOptions =
	{
		overviewRulerBorder: false,
		hideCursorInOverviewRuler: true,
		automaticLayout: true,
		minimap: {
			enabled: false,
		},
		extraEditorClassName: 'px-3',
		fontFamily: 'Inter, sans-serif',
		folding: false,
		lineNumbers: 'off',
		lineDecorationsWidth: 0,
		lineNumbersMinChars: 0,
		renderLineHighlight: 'none',
		renderValidationDecorations: 'off',
		glyphMargin: false,
		autoClosingBrackets: 'never',
		matchBrackets: 'never',
		scrollbar: {
			vertical: 'hidden',
			horizontal: 'hidden',
			alwaysConsumeMouseWheel: false,
			handleMouseWheel: false,
		},
		autoIndent: 'none',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		'bracketPairColorization.enabled': false,
	};
