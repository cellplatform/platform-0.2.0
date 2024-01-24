import { TestDb as Base } from 'ext.lib.automerge';
import { DevReload } from 'sys.data.indexeddb';

export const TestDb = {
  ...Base,
  DevReload,
} as const;
