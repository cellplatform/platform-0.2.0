import { Color, css, t, Text, Processor } from '../common';
import { MarkdownUtil } from '../Markdown/Markdown.Util.mjs';

const Imports = {
  Image: () => import('../Markdown.Doc.Components/Doc.Image'),
  Error: () => import('../Markdown.Doc.Components/Doc.Error'),
};

/**
 * Default markdown to display (HTML, Component) renderer.
 */
export const defaultRenderer: t.MarkdownDocBlockRenderer = async (e) => {
  const { md } = e;
  const Markdown = Text.Markdown;

  /**
   * Process <Image> with Component.
   */
  const imageNode = Markdown.Find.image(e.node);
  if (imageNode) {
    const { DocImage } = await Imports.Image();

    const codeNode = md.info.code.typed.find((c) => {
      return c.type.startsWith('doc.image') && c.type.includes(' id:');
    });

    let def: t.DocImageDef | undefined;

    /**
     * TODO 🐷
     * - Refactor
     */
    if (codeNode && codeNode.lang === 'yaml') {
      try {
        def = Text.Yaml.parse(codeNode.text);
      } catch (error: any) {
        console.error(error);
        const { DocError } = await Imports.Error();
        const msg = `Failed while parsing YAML within block \`${codeNode.type}\``;
        console.log('codeNode', codeNode);
        return <DocError message={msg} error={error} />;
      }
    }

    return <DocImage node={imageNode} def={def} />;
  }

  /**
   * Blockquote.
   */
  if (e.node.type === 'blockquote') {
    const { DocQuote } = await import('../Markdown.Doc.Components/Doc.Quote');
    const text = md.toString(e.node.position);
    return <DocQuote markdown={text} node={e.node} />;
  }

  /**
   * Process raw HTML.
   */
  const text = md.toString(e.node.position);
  const { html } = await Processor.toHtml(text);
  return html;
};
