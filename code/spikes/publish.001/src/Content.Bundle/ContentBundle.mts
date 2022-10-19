import { t, Path } from '../common/index.mjs';
import { MarkdownFile } from '../Markdown.File/index.mjs';
import { Filesize } from 'sys.fs';
import { ContentLog } from '../Content.Log/ContentLog.mjs';

type Sources = {
  app: t.Fs; //     The compiled bundle of the content rendering "app" (application).
  content: t.Fs; // The source markdown content, and other assorted "author(s) generated" content.
};

type Args = {
  Text: t.Text;
  src: Sources;
  propsType?: string;
  throwError?: boolean;
};

/**
 * Setup a deployment.
 */
export async function ContentBundle(args: Args) {
  const { Text, src, throwError, propsType = 'project.props' } = args;

  /**
   * Load and parse the README file.
   */
  const README = await MarkdownFile({
    Text,
    src: src.content,
    path: 'README.md',
    propsType,
    throwError,
  });

  const version = README.props.version;

  const paths: t.BundlePaths = {
    app: {
      base: 'app/',
      assets: 'app/assets/',
    },
    data: {
      md: 'data.md/',
    },
  };

  const write = {
    /**
     * Write the content to the given filesystem location.
     */
    async bundle(target: t.Fs, options: { dir?: string; logdir?: t.Fs; srcdir?: t.Fs } = {}) {
      const { logdir, srcdir } = options;
      const source = await src.app.manifest();
      const base = `${Path.trimSlashesEnd(options.dir ?? version)}/`;
      const appfs = target.dir(Path.join(base, paths.app.base));

      /**
       * Copy the application bundle.
       */
      await Promise.all(
        source.files.map(async (file) => {
          await appfs.write(file.path, await src.app.read(file.path));
        }),
      );

      /**
       * Copy and process source content (data).
       */
      await write.data(appfs, { logdir, manifest: false, vercelConfig: true });
      await appfs.write('index.json', await appfs.manifest());

      /**
       * Copy in source (.ts files) from "/src"
       * Used for vercel edge functions.
       */
      if (options.srcdir) {
        const fs = options.srcdir;
        const m = await fs.manifest({ dir: '/api/' });
        for (const { path } of m.files) {
          await target.write(path, await fs.read(path));
        }
      }

      /**
       * Write root level README.
       */
      await README.write(target, { dir: base, html: false });
      const fs = target.dir(base);
      const manifest = await fs.manifest();
      await fs.write('index.json', manifest);

      // Finish up.
      const api = {
        version,

        dir: {
          app: paths.app.base,
        },

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
            assets: toSize(manifest, (path) => match(path, paths.app.assets)),
            data: {
              md: toSize(manifest, (path) => match(path, paths.app.base, paths.data.md)),
            },
          };
        },

        /**
         * Data about write operation to be written to a log.
         */
        toObject(): t.BundleLogEntry {
          const { size } = api;
          const kind = 'pkg:content-bundle';
          return { kind, version, size, paths };
        },
      };

      return api;
    },

    /**
     * Write content
     */
    async data(
      target: t.Fs,
      options: {
        logdir?: t.Fs;
        manifest?: boolean;
        vercelConfig?: boolean;
      } = {},
    ) {
      const MD = Text.Processor.markdown();
      const source = await src.content.manifest();

      /**
       * Copy source content files.
       */
      await Promise.all(
        source.files.map(async (file) => {
          const data = await src.content.read(file.path);
          const md = await MD.toHtml(data);
          const path = Path.join(paths.data.md, file.path);
          await target.write(path, md.markdown);
        }),
      );

      if (options.manifest) {
        const manifest = await target.manifest();
        await target.write('index.json', manifest);
      }

      /**
       * Copy in a summary of the log (latest n-items).
       */
      let log: t.PublicLogSummary | undefined;
      if (options.logdir) {
        const logger = ContentLog.log(options.logdir);
        log = await logger.publicSummary({ max: 50 });
        await target.write('log.public.json', log);
      }

      /**
       * Write a [vercel.json] configuration file.
       * Ref:
       *  - https://vercel.com/docs/project-configuration#project-configuration/redirects
       *  - https://vercel.com/docs/project-configuration#project-configuration/rewrites
       */
      if (options.vercelConfig) {
        type VercelConfig = { cleanUrls?: boolean; redirects?: Redirect[]; rewrites?: Rewrite[] };
        type Redirect = { source: string; destination: string };
        type Rewrite = { source: string; destination: string };

        const redirects: Redirect[] = [];
        const rewrites: Rewrite[] = [];

        // Display root renderer from any version match.
        rewrites.push({ source: '/:version', destination: '/' });

        // Redirect to latest version.
        if (log?.latest) {
          const version = log.latest.version;
          redirects.push({ source: '/', destination: version });
        }

        const config: VercelConfig = {
          cleanUrls: true,
          redirects,
          rewrites,
        };
        await target.write('vercel.json', config);
      }
    },
  };

  return {
    version,
    write,
    get README() {
      return README;
    },
  };
}

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
