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
export async function ContentPipeline(args: Args) {
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
  const dir = `${version}`;

  const api = {
    version,
    dir,

    get README() {
      return README;
    },

    async write(target: t.Fs, options: { dir?: string } = {}) {
      const dir = options.dir ? Path.join(options.dir, api.dir) : api.dir;
      await README.write(target, { dir });
    },
  };

  return api;
}
