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
        app: 'app',
        data: {
          md: 'app/data.md',
          html: 'app/data.html',
        },
      };

      const appManifest = await src.app.manifest();
      const contentManifest = await src.content.manifest();

      /**
       * Copy the application bundle.
       */
      await Promise.all(
        appManifest.files.map(async (file) => {
          const path = Path.join(base, dir.app, file.path);
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
            await target.write(Path.join(dir.base, dir.data.html, `${file.path}.html`), md.html);
          }),
        );

        // await target.write(Path.join(base, 'index.json'), manifest);
        const dirname = Path.join(base, dir.app);
        const fs = target.dir(dirname);
        const manifest = await fs.manifest();
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
      return {
        dir,
        version,
        get manifest() {
          return manifest;
        },
        get fs() {
          return fs;
        },
      };
    },
  };

  return api;
}
