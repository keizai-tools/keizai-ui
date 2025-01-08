import { Environment } from './environment';
import { Folder } from './folder';
import type { Invocation } from './invocation';

export type Collection = {
  id: string;
  name: string;
  folders: Folder[];
  environments: Environment[];
  invocations: Invocation[];
};
