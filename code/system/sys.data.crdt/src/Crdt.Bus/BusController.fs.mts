import { t, Automerge, Is, CrdtPath } from './common.mjs';

type SaveResponse = { paths: string[]; error?: string };

export const CrdtFilesystem = {
  /**
   * Delegate to the specified save strategy.
   *
   */
  async save<T>(
    strategy: t.CrdtSaveStrategy,
    args: { fs: t.Fs; path: string; data: T; json?: boolean },
  ): Promise<SaveResponse> {
    const paths: string[] = [];
    const fail = (error: string) => ({ paths, error });

    if (strategy === 'Doc') return CrdtFilesystem.doc.save(args);
    if (strategy === 'Log') return CrdtFilesystem.log.save(args);

    return fail(`Save strategy "${strategy}" not supported.`);
  },

  /**
   * STRATEGY: Save using the default complete document strategy.
   */
  doc: {
    async save<T>(args: {
      fs: t.Fs;
      path: string;
      data: T;
      json?: boolean;
    }): Promise<SaveResponse> {
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
          const json = `${JSON.stringify(data)}\n`;
          paths.push(path);
          await fs.write(path, json);
        }
      } catch (error: any) {
        return fail(`Error saving CRDT. ${error.message}`);
      }

      // Finish up.
      return done();
    },
  },

  /**
   * STRATEGY: Save using the "append only log" strategy.
   */
  log: {
    async save<T>(args: {
      fs: t.Fs;
      path: string;
      data: T;
      json?: boolean;
    }): Promise<SaveResponse> {
      const paths: string[] = [];

      const done = (args: { error?: string } = {}) => ({ paths, error: args.error });
      const fail = (error: string) => done({ error });

      /**
       * TODO 🐷
       *    https://github.com/cellplatform/platform-0.2.0/issues/53
       *    https://automerge.org/docs/cookbook/persistence/
       */
      const strategy: t.CrdtSaveStrategy = 'Log';
      return fail(`Save strategy "${strategy}" not implemented.`);
    },
  },
};
