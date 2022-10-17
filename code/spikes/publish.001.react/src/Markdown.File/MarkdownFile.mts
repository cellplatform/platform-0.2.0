import { t, Path } from '../common/index.mjs';

type B = t.MarkdownPropsBase;

/**
 * Load the root README.md as an informational data-structure.
 */

export async function MarkdownFile<T extends B = B>(args: t.MarkdownFileFactoryArgs) {
  const { Text, src: sourcefs, propsType, throwError } = args;
  const file = Path.parts(args.path);
  let _error = '';

  const exists = await sourcefs.exists(file.path);
  if (!exists) {
    _error = `File not found: ${file.path}`;
    if (throwError) throw new Error(_error);
  }

  const binary = await sourcefs.read(file.path);
  const text = new TextDecoder().decode(binary);
  const processor = Text.Processor.markdown();

  const md = await processor.toHtml(text);
  const propsBlock = md.info.codeblocks.filter((m) => m.type === propsType)[0];
  const props = (propsBlock ? Text.Yaml.parse(propsBlock.text) : { version: '0.0.0' }) as T;

  const content = {
    html: md.html,
    markdown: md.markdown,
  };

  const api: t.MarkdownFile<T> = {
    file,
    props,
    error: _error || undefined,

    get content() {
      return content;
    },

    /**
     * Write the README's to the given file-storage location.
     */
    async write(fs: t.Fs, options: { dir?: string; html?: boolean; md?: boolean } = {}) {
      const { html = true, md = true } = options;
      const base = options.dir ?? '';
      const path = (ext: string) =>
        Path.join(...[base, file.dir, `${file.name}${ext}`].filter(Boolean));

      if (md) await fs.write(path('.md'), content.markdown); //   Raw Markdown
      if (html) await fs.write(path('.md.html'), content.html); //  Markdown as HTML
    },
  };

  return api;
}
