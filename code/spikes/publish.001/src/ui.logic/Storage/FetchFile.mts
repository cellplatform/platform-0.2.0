import { t, TestFilesystem, Filesystem } from '../common';

/**
 * TODO 🐷
 * Encapsulate file/fetch/file-system manipulation.
 */

export const FetchFile = {
  /**
   * Retrieve the local filesystem.
   */
  async fs(options: { bus?: t.EventBus<any>; dispose$?: t.Observable<any> } = {}) {
    const isIndexedDbAvailable = typeof window?.indexedDB === 'object';

    // NB: Running on non-browser runtime (probably within tests).
    if (!isIndexedDbAvailable) return TestFilesystem.memory().fs;

    const { bus, dispose$ } = options;
    return (await Filesystem.client({ bus, dispose$ })).fs;
  },

  /**
   * Helpers for a single file.
   */
  from(fs: t.Fs, path: string) {
    return {
      path,
    };
  },
};
