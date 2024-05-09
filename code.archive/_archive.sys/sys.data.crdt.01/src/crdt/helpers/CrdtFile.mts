import { Automerge, type t } from './common';

/**
 * Helpers for working with CRDT filesystem operations
 */
export const CrdtFile = {
  /**
   * Write the to the filesystem.
   */
  async save(fs: t.Fs, filename: string, doc: t.CrdtDocRef<any>) {
    if (doc.disposed) throw new Error('Cannot save, the filesystem is disposed.');
    const data = Automerge.save(doc.current);
    const { bytes, hash } = await fs.write(filename, data);
    return { filename, bytes, hash } as const;
  },
} as const;
