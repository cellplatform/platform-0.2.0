import { FsMockDriver } from './Mock.Driver.mjs';
import { FsMockIndexer } from './Mock.Indexer.mjs';

export { FsMockDriver, FsMockIndexer };

export const FsMock = {
  Indexer: FsMockIndexer,
  Driver: FsMockDriver,
};
