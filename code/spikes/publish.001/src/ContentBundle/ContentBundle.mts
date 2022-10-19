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

  const toPaths = (dir?: string) => {
    const base = dir ?? version;
    return {
      base,
      app: {
        base: Path.join(base, 'app/'),
        assets: Path.join(base, 'app/assets/'),
      },
      data: {
        md: Path.join(base, 'app/data.md/'),
      },
    };
  };

  const write = {
    /**
     * Write the content to the given filesystem location.
     */
    async bundle(target: t.Fs, options: { dir?: string } = {}) {
      const source = await src.app.manifest();
      const dir = toPaths(options.dir);
      const { base } = dir;

      /**
       * Copy the application bundle.
       */
      await Promise.all(
        source.files.map(async (file) => {
          const path = Path.join(dir.app.base, file.path);
          const data = await src.app.read(file.path);
          await target.write(path, data);
        }),
      );

      /**
       * Copy and process source content (data).
       */
      write.data(target, { dir: base });

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
          const trimBase = (path: string) => path.substring(base.length + 1);
          const startsWith = (path: string, match: string) => path.startsWith(trimBase(match));
          return {
            total: toSize(manifest, () => true),
            assets: toSize(manifest, (path) => startsWith(path, dir.app.assets)),
            data: {
              md: toSize(manifest, (path) => startsWith(path, dir.data.md)),
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

    /**
     * Write data
     */
    async data(target: t.Fs, options: { dir?: string } = {}) {
      const dir = toPaths(options.dir);
      const source = await src.content.manifest();
      const MD = Text.Processor.markdown();

      await Promise.all(
        source.files.map(async (file) => {
          const data = await src.content.read(file.path);
          const md = await MD.toHtml(data);
          await target.write(Path.join(dir.data.md, file.path), md.markdown);
        }),
      );

      const dirname = Path.join(dir.app.base);
      const manifest = await target.dir(dirname).manifest();
      await target.write(Path.join(dirname, 'index.json'), manifest);
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
