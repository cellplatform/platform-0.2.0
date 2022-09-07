import type * as t from './common/types.mjs';

export type FsIndexedDb = t.Disposable & {
  id: string;
  version: number;
  driver: t.FsDriver;
  database: IDBDatabase;
};
