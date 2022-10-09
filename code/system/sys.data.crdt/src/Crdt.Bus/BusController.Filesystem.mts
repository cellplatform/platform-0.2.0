import { t, Automerge, Is, CrdtPath } from './common.mjs';

export const Filesystem = {
  /**
   * Helpers for saving a CRDT document to filesystem storage.
   */
  save: {
    /**
     * Save using the default strategy.
     */
    async default<T>(args: { fs: t.Fs; path: string; data: T; json?: boolean }) {
      const { fs } = args;
      const data = args.data as Automerge.FreezeObject<any>;
      const paths: string[] = [];

      const done = (args: { error?: string } = {}) => ({ paths, error: args.error });
      const fail = (error: string) => done({ error });

      if (!Is.automergeObject(data)) {
        return fail(`Cannot save document. The given data is not an Automerge object.`);
      }

      try {
        const format = CrdtPath.format(args.path);
        const binary = Automerge.save(args.data as Automerge.FreezeObject<any>);

        const defaultPath = format.toString({});
        paths.push(defaultPath);
        await fs.write(defaultPath, binary);

        if (args.json) {
          const path = format.toString({ json: true });
          const json = `JSON.stringify(data)\n`;
          paths.push(path);
          await fs.write(path, json);
        }
      } catch (error: any) {
        return fail(`Error saving CRDT data. ${error.message}`);
      }

      // Finish up.
      return done();
    },
  },
};
