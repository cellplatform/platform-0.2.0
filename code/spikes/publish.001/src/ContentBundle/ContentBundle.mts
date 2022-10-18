import { t, Path } from '../common/index.mjs';
import { MarkdownFile } from '../Markdown.File/index.mjs';
import { Filesize } from 'sys.fs';

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

  const api = {
    version,

    get README() {
      return README;
    },

    /**
     * Write the content to the given filesystem location.
     */
    async write(target: t.Fs, options: { dir?: string } = {}) {
      const base = options.dir ? Path.join(options.dir, version) : version;
      const dir = {
        base,
        app: {
          base: 'app/',
          assets: 'app/assets/',
        },
        data: {
          md: 'app/data.md/',
          // html: 'app/data.html/',
        },
      };

      const appManifest = await src.app.manifest();
      const contentManifest = await src.content.manifest();

      /**
       * Copy the application bundle.
       */
      await Promise.all(
        appManifest.files.map(async (file) => {
          const path = Path.join(base, dir.app.base, file.path);
          const data = await src.app.read(file.path);
          await target.write(path, data);
        }),
      );

      /**
       * Copy and process source content.
       */
      (async () => {
        const MD = Text.Processor.markdown();

        await Promise.all(
          contentManifest.files.map(async (file) => {
            const data = await src.content.read(file.path);
            const md = await MD.toHtml(data);
            await target.write(Path.join(dir.base, dir.data.md, file.path), md.markdown);
            // await target.write(Path.join(dir.base, dir.data.html, `${file.path}.html`), md.html);
          }),
        );

        const dirname = Path.join(base, dir.app.base);
        const manifest = await target.dir(dirname).manifest();
        await target.write(Path.join(dirname, 'index.json'), manifest);
      })();

      /**
       * Write root level README.
       */
      await README.write(target, { dir: base, html: false });
      const fs = target.dir(base);
      const manifest = await fs.manifest();
      await target.write(Path.join(base, 'index.json'), manifest);

      // Finish up.
      const api = {
        version,
        dir,
        get manifest() {
          return manifest;
        },
        get size() {
          return {
            total: toSize(manifest, () => true),
            assets: toSize(manifest, (path) => path.startsWith(dir.app.assets)),
            data: {
              md: toSize(manifest, (path) => path.startsWith(dir.data.md)),
              // html: toSize(manifest, (path) => path.startsWith(dir.data.html)),
            },
          };
        },

        /**
         * Scoped filesystem that was written to.
         * Example (use): fs.manifest()
         */
        get fs() {
          return fs;
        },

        /**
         * Data about write operation to be written to a log.
         */
        toObject() {
          const { size } = api;
          const kind = 'pkg:content-bundle';
          return { kind, dir, version, size };
        },
      };

      return api;
    },
  };

  return api;
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
