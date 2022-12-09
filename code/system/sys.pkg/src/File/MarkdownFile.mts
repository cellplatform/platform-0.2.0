import { t, Path } from '../common';

type B = t.MarkdownPropsBase;

/**
 * Represents a markdown file stored within the given [src] filesystem.
 */
export async function MarkdownFile<T extends B = B>(args: t.MarkdownFileFactoryArgs) {
  const { Text, src, propsType, throwError } = args;
  const file = Path.parts(args.path);
  let _error = '';

  const exists = await src.exists(file.path);
  if (!exists) {
    _error = `File not found: ${file.path}`;
    if (throwError) throw new Error(_error);
  }

  const binary = await src.read(file.path);
  const text = new TextDecoder().decode(binary);
  const processor = Text.Processor.markdown();

  const md = await processor.toHtml(text);
  const propsBlock = md.info.code.typed.filter((m) => m.type === propsType)[0];
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
     * Write to the given file-storage location.
     */
    async write(target: t.Fs, options: { dir?: string; html?: boolean; md?: boolean } = {}) {
      const { html = true, md = true } = options;
      const base = options.dir ?? '';
      const path = (ext: string) =>
        Path.join(...[base, file.dir, `${file.name}${ext}`].filter(Boolean));

      if (md) await target.write(path('.md'), content.markdown); //   Raw Markdown
      if (html) await target.write(path('.md.html'), content.html); //  Markdown as HTML
    },
  };

  return api;
}
