export const editorHelpers = [
  'setEnviromentVariable',
  'clearEnviromentVariable',
  'clearAllEnviromentVariables',
  'getCollectionVariableValue',
];

export const editorTestsHelpers = [...editorHelpers, 'getInvocationResponse'];

export const editorHelpersDescriptions: { [key: string]: string } = {
  setEnviromentVariable: 'Set an enviroment variable',
  clearEnviromentVariable: 'Clear an enviroment variable',
  clearAllEnviromentVariables: 'Clear all enviroment variables',
  getCollectionVariableValue: 'Get the value of a collection variable',
};

export const editorTestsHelpersDescriptions: { [key: string]: string } = {
  ...editorHelpersDescriptions,
  getInvocationResponse: 'Get the invocation response',
};
