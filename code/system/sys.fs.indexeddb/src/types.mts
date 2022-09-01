import * as t from './common/types.mjs';

export type FsIndexedDb = t.Disposable & {
  id: string;
  version: number;
  driver: t.FsDriver;
  index: t.FsIndexer;
};
