import type { t } from '../common';

type DirPath = string;

/**
 * Factory function for creating a filesystem driver.
 */
export type FsDriverFactory = (dir?: DirPath) => Promise<t.FsDriver>;

/**
 * A driver that implements a bridge to an underlying platform filesystem
 * or other path addressable [Uint8Array] storage mechanism.
 */
export type FsDriver = {
  io: t.FsIO;
  indexer: t.FsIndexer;
};
