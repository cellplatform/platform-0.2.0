import { t } from './common.mjs';

type DirPathString = string;

/**
 * Factory function for creating a filesystem driver.
 */
export type FsDriverFactory = (dir?: DirPathString) => Promise<t.FsDriver>;

/**
 * A driver that implements a bridge to an underlying platform filesystem
 * or other path addressable [Uint8Array] storage mechanism.
 */
export type FsDriver = {
  io: t.FsDriverIO;
  indexer: t.FsIndexer;
};
