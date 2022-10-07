import { t, Automerge, Is } from './common.mjs';

export const Filesystem = {
  /**
   * Helpers for saving a CRDT document to filesystem storage.
   */
  save: {
    /**
     * Save using the default strategy.
     */
    async default<T>(args: { fs: t.Fs; path: string; data: T }) {
      const { fs, path } = args;
      const data = args.data as Automerge.FreezeObject<any>;

      const done = (args: { error?: string } = {}) => ({ error: args.error });
      const fail = (error: string) => done({ error });

      if (!Is.automergeObject(data)) {
        return fail(`Cannot save document. The given data is not an Automerge object.`);
      }

      try {
        const binary = Automerge.save(args.data as Automerge.FreezeObject<any>);
        await fs.write(path, binary);
      } catch (error: any) {
        return fail(`Error saving CRDT data. ${error.message}`);
      }

      // Finish up.
      return done();
    },
  },
};
