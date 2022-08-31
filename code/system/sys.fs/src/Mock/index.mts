import { FsMockDriver } from './Mock.Driver.mjs';
import { FsMockIndexer } from './Mock.Indexer.mjs';
import { randomFile } from './util.mjs';
export { DEFAULT } from './common.mjs';

export { FsMockDriver, FsMockIndexer };

export const FsMock = {
  Indexer: FsMockIndexer,
  Driver: FsMockDriver,
  randomFile,
};
