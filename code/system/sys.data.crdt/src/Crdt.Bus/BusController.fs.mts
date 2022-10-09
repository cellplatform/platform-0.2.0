import { Automerge, CrdtPath, Is, t } from './common.mjs';

type SaveResponse = { paths: string[]; error?: string };
type LoadResponse<T> = { path: string; doc?: T; error?: string };

export const CrdtFilesystem = {
  /**
   * Delegate to the specified save strategy.
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
   * Delegate to the specified load strategy.
   */
  async load<T>(
    strategy: t.CrdtSaveStrategy,
    args: { fs: t.Fs; path: string; data: T; json?: boolean },
  ): Promise<LoadResponse<T>> {
    const { path } = args;
    const fail = (error: string) => ({ path, error });

    if (strategy === 'Doc') return CrdtFilesystem.doc.load(args);
    if (strategy === 'Log') return CrdtFilesystem.log.load(args);

    return fail(`Load strategy "${strategy}" not supported.`);
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
      const format = CrdtPath.format(args.path);

      const done = (args: { error?: string } = {}) => ({ paths, error: args.error });
      const fail = (error: string) => done({ error });

      if (!Is.automergeObject(data)) {
        return fail(`Cannot save document. The given data is not an Automerge object.`);
      }

      try {
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
        return fail(`Error saving CRDT to path "${args.path}". ${error.message}`);
      }

      // Finish up.
      return done();
    },

    async load<T>(args: { fs: t.Fs; path: string; json?: boolean }): Promise<LoadResponse<T>> {
      const { fs } = args;
      const path = CrdtPath.format(args.path).toString();

      const done = (args: { doc?: T; error?: string } = {}) => {
        const { doc, error } = args;
        return { path, doc, error };
      };
      const fail = (error: string) => done({ error });

      const exists = await fs.exists(path);
      if (!exists) return fail(`Error loading CRDT. The path "${path}" does not exist.`);

      try {
        const binary = (await fs.read(path)) as Automerge.BinaryDocument;
        const doc = Automerge.load(binary) as T;
        return done({ doc });
      } catch (error: any) {
        return fail(`Error loading CRDT. ${error.message}`);
      }
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

    async load<T>(args: { fs: t.Fs; path: string; json?: boolean }): Promise<LoadResponse<T>> {
      const path = CrdtPath.format(args.path).toString();

      const done = (args: { error?: string } = {}) => ({ path, error: args.error });
      const fail = (error: string) => done({ error });

      /**
       * TODO 🐷
       *    https://github.com/cellplatform/platform-0.2.0/issues/53
       *    https://automerge.org/docs/cookbook/persistence/
       */
      const strategy: t.CrdtSaveStrategy = 'Log';
      return fail(`Load strategy "${strategy}" not implemented.`);
    },
  },
};
