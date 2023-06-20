/**
 * Module (Meta)
 */
import { Pkg } from './index.pkg.mjs';
export { Pkg };

/**
 * Filesystem
 */
export { Path, Filesize, Bus, MemoryMock } from 'sys.fs';
export { IndexedDbDriver } from './IndexedDb.Fs.Driver';
export { Filesystem } from './Filesystem.mjs';

/**
 * Dev
 */
export { TestFilesystem } from './TestFilesystem.mjs';
export const dev = async () => {
  const { Specs } = await import('./test.ui/entry.Specs.mjs');
  return { Pkg, Specs };
};
