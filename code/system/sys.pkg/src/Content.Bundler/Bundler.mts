import { Filesize, Path, t } from '../common';
import { ContentLogger } from '../Content.Logger';
import { MarkdownFile } from '../File';
import { BundlePaths } from './Paths.mjs';

type Sources = {
  app: t.Fs; //                The compiled bundle of the content rendering "app" (application).
  data: t.Fs; //               The author generated content data.
  src?: t.Fs; //   (optional)  The "/src" source code folder (containing known "*.ts" files, such as [middleware.ts] etc).
  log?: t.Fs; //   (optinoal)  The place to read/write logs (overwritable in method calls)
};

type CreateArgs = {
  Text: t.Text;
  sources: Sources;
  propsType?: string;
  throwError?: boolean;
};

/**
 * Content bundler.
 */
export const ContentBundler = {
  Paths: BundlePaths,

  /**
   * Create an instance of the content bundler.
   */
  async create(args: CreateArgs) {
    const { Text, sources, throwError = true, propsType = 'project.props' } = args;

    /**
     * Load and parse the README file.
     */
    const README = await MarkdownFile({
      Text,
      src: sources.data,
      path: 'README.md',
      propsType,
      throwError,
    });

    const version = README.props.version;

    const write = {
      /**
       * Write the content to the given filesystem location.
       */
      async bundle(target: t.Fs, options: { dir?: string; latest?: boolean } = {}) {
        const source = await sources.app.manifest();
        const base = `${Path.trimSlashesEnd(options.dir ?? version)}/`;
        const appfs = target.dir(Path.join(base, BundlePaths.app.base));

        /**
         * Delete existing bundle (if any).
         */
        await target.delete(base);

        /**
         * Root README.
         */
        await README.write(target, { dir: base, html: false });

        /**
         * Copy the application bundle.
         */
        await Promise.all(
          source.files.map(async (file) => {
            const data = await sources.app.read(file.path);
            await appfs.write(file.path, data);
          }),
        );

        /**
         * Copy and process source content (data).
         */
        await write.data(appfs);

        /**
         * Copy in known source (.ts) files from "/src"
         * Used for vercel edge functions.
         */
        if (sources.src) {
          const m = await sources.src.manifest({ dir: '/api/' });
          for (const { path } of m.files) {
            const data = await sources.src.read(path);
            await appfs.write(path, data);
          }

          const middlewareFile = 'middleware.ts';
          if (await sources.src.exists(middlewareFile)) {
            await appfs.write(middlewareFile, await sources.src.read(middlewareFile));
          }

          // Used by edge/middleware functions on Vercel.
          const pkg = {
            dependencies: { '@vercel/edge': '0.0.5' },
            devDependencies: { typescript: '4.8.4' },
            licence: 'MIT',
          };

          await appfs.write('package.json', pkg);
        }

        /**
         * Write a [vercel.json] configuration file.
         * NOTE:
         *    Most of the routing will probably handled within a [src.middleware.ts] file.
         * REF:
         *  - https://vercel.com/docs/project-configuration#project-configuration
         */
        const config: t.VercelConfigFile = { cleanUrls: true, trailingSlash: true };
        await appfs.write('vercel.json', config);

        /**
         * Write [index.json] manifests.
         */
        const fs = target.dir(base);
        const manifest = await fs.manifest();
        await fs.write('index.json', manifest);
        await appfs.write('index.json', await appfs.manifest());

        /**
         * Make a copy to ".latest" in the output directory.
         */
        if (options.latest !== false) {
          await target.delete(BundlePaths.latest); // Clear away existing.
          const from = target.dir(base);
          const to = target.dir(BundlePaths.latest);
          for (const file of (await from.manifest()).files) {
            const data = await from.read(file.path);
            await to.write(file.path, data);
          }
        }

        // Finish up.
        const api = {
          version,

          dir: { app: BundlePaths.app.base },

          get manifest() {
            return manifest;
          },

          /**
           * Scoped filesystem that was written to.
           * Example usage: passed into the `deploy` pipeline.
           */
          get fs() {
            return fs;
          },

          get size() {
            const match = (subj: string, ...path: string[]) => subj.startsWith(Path.join(...path));
            return {
              total: toSize(manifest, () => true),
              lib: toSize(manifest, (path) => match(path, BundlePaths.app.lib)),
              data: {
                md: toSize(manifest, (path) =>
                  match(path, BundlePaths.app.base, BundlePaths.data.md),
                ),
              },
            };
          },

          /**
           * Data about write operation to be written to a log.
           */
          toObject(): t.BundleLogEntry {
            const { size } = api;
            const kind = 'pkg:content-bundle';
            const paths = BundlePaths;
            return { kind, version, size, paths };
          },
        };

        return api;
      },

      /**
       * Write content
       */
      async data(target: t.Fs) {
        const MD = Text.Processor.markdown();
        const source = await sources.data.manifest();

        /**
         * Copy source "content" files.
         */
        await Promise.all(
          source.files.map(async (file) => {
            const data = await sources.data.read(file.path);
            const md = await MD.toMarkdown(data);
            const path = Path.join(BundlePaths.data.md, file.path);
            await target.write(path, md.markdown);
          }),
        );

        /**
         * Copy in a summary of the log (latest n-items).
         */
        let log: t.PublicLogSummary | undefined;
        if (sources.log) {
          const fs = sources.log;
          const logger = ContentLogger.create(fs);
          const latest = version;
          log = await logger.publicSummary({ max: 50, latest });
          await target.write(BundlePaths.data.log, log);
        }

        /**
         * Data folder [index.json] manfiest
         */
        const datafs = target.dir(BundlePaths.data.base);
        await datafs.write('index.json', await datafs.manifest());
      },
    };

    return {
      version,
      write,
      get README() {
        return README;
      },
    };
  },
};

/**
 * Helpers
 */

const toSize = (manifest: t.DirManifest, filter: (path: string) => boolean) => {
  const bytes = manifest.files
    .filter(({ path }) => filter(`${Path.trimSlashesEnd(path)}/`))
    .map(({ bytes }) => bytes)
    .reduce((acc, next) => acc + next, 0);
  const size = Filesize(bytes);
  return { bytes, size };
};
