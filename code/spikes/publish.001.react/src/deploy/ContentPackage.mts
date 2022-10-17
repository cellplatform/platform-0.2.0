import { t, Path } from '../common/index.mjs';
import { MarkdownFile } from '../Markdown.File/index.mjs';

type Sources = {
  app: t.Fs;
  content: t.Fs;
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
export async function ContentPackage(args: Args) {
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
    dir: `${version}`,

    get README() {
      return README;
    },

    /**
     * Write the content to the given filesystem location.
     */
    async write(target: t.Fs, options: { dir?: string } = {}) {
      const dir = options.dir ? Path.join(options.dir, api.dir) : api.dir;

      /**
       * Copy the application bundle (renders data).
       */
      const app = await src.app.manifest();
      await Promise.all(
        app.files.map(async (file) => {
          const path = Path.join(dir, file.path);
          const data = await src.app.read(file.path);
          await target.write(path, data);
        }),
      );

      /**
       * Copy root meta-data.
       */
      await README.write(target, { dir });

      // Store index JSON.
      const fs = target.dir(dir);
      const manifest = await fs.manifest();
      await target.write(Path.join(dir, 'index.json'), manifest);

      // Finish up.
      return {
        get target() {
          return { fs, dir, manifest };
        },
      };
    },
  };

  return api;
}
