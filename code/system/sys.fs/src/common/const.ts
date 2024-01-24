import type { t } from '../common';

/**
 * Constants
 */
const ERROR_MANIFEST: t.DirManifest = {
  kind: 'dir',
  dir: { indexedAt: -1 },
  hash: { dir: '', files: '' },
  files: [],
};

export const DEFAULT = {
  ERROR_MANIFEST,
  CACHE_FILENAME: '.manifest.json',
  FILESYSTEM_ID: 'fs',
} as const;
