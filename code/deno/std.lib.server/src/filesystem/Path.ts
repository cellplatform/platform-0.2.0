import { ensureDir, exists } from '@std/fs';
import { Path as Base } from '@sys/stdlib';

/**
 * Path helpers.
 */
export const Path = {
  ...Base,
  exists,
  ensureDir,
} as const;
