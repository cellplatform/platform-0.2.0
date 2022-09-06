import { t } from './common.mjs';

type DirPathString = string;

/**
 * Factory function for creating a driver.
 */
export type FsDriverFactory = (dir?: DirPathString) => Promise<t.FsDriver>;

/**
 * TODO 🐷
 */
export type FsDriver = {
  io: t.FsDriverIO;
  indexer: t.FsIndexer;
};
