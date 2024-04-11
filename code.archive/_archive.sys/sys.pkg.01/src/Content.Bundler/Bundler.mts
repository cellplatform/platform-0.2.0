import { Filesize, Path, TestFilesystem, type t } from '../common';
import { ContentLogger } from '../Content.Logger';
import { MarkdownFile } from '../File';
import { BundlePaths } from './Paths.mjs';

type SemVer = string;

type Sources = {
  app: t.Fs; //                The compiled bundle of the rendering "app" (eg. the "/dist" folder).
  data: t.Fs; //               Content data.
  src?: t.Fs; //   (optional)  The "/src" source code folder (containing known "*.ts" files, such as [middleware.ts] etc).
  log?: t.Fs; //   (optional)  The place to read/write logs (overwritable in method calls)
};

type CreateArgs = {
  Text: t.Text;
  sources: Sources;
  readmePropsType?: string; // The name of the YAML block within the README that represents the props for the content-data.
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
    const { Text, sources, throwError = true, readmePropsType: propsType = 'project.props' } = args;
    const logger = ContentLogger.create(args.sources.log ?? TestFilesystem.memory().fs);

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

    const write = {
      /**
       * Write the content to the given filesystem location.
       */
      async bundle(
        target: t.Fs,
        version: SemVer,
        options: { dir?: string; latest?: boolean } = {},
      ) {
        const source = await sources.app.manifest();
        const base = `${Path.trimSlashesEnd(options.dir ?? version)}/`;
        const appfs = target.dir(Path.join(base, BundlePaths.app.base));
        const datafs = target.dir(Path.join(base, BundlePaths.app.data));

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
        await write.data(datafs, version);

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
            dependencies: { '@vercel/edge': '0.1.2' },
            devDependencies: { typescript: '4.9.4' },
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
          fs,
          dirs: { app: BundlePaths.app.base },
          logger,

          get manifest() {
            return manifest;
          },

          get size() {
            const match = (subj: string, ...path: string[]) => subj.startsWith(Path.join(...path));
            return {
              total: toSize(manifest, () => true),
              lib: toSize(manifest, (path) => match(path, BundlePaths.app.lib)),
              data: {
                md: toSize(manifest, (path) =>
                  match(path, BundlePaths.app.data, BundlePaths.data.md),
                ),
              },
            };
          },

          /**
           * Data about write operation to be written to a log.
           */
          toObject(): t.BundleLogEntry {
            const { size } = api;
            const paths = BundlePaths;
            return {
              kind: 'pkg:bundle',
              version,
              size,
              paths,
            };
          },
        };

        return api;
      },

      /**
       * Write content
       */
      async data(datafs: t.Fs, version: SemVer) {
        const processor = Text.Processor.markdown();
        const source = await sources.data.manifest();

        /**
         * Copy source "content" files.
         */
        await Promise.all(
          source.files.map(async (file) => {
            const Paths = BundlePaths;
            const data = await sources.data.read(file.path);
            const md = await processor.toMarkdown(data);
            const path = Path.join(Paths.data.md, file.path);
            await datafs.write(path, md.markdown);
          }),
        );

        /**
         * Copy in a summary of the log (latest n-items).
         */
        if (logger) {
          const latest = version;
          const summary = await logger.publicSummary({ max: 50, latest });
          await datafs.write(BundlePaths.data.logfile, summary);
        }

        /**
         * Data folder [index.json] manfiest
         */
        await datafs.write('index.json', await datafs.manifest());
      },
    };

    return {
      write,
      logger,
      README,
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
