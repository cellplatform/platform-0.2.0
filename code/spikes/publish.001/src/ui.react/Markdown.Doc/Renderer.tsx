import { Processor, t, Text } from '../common';
import { MarkdownUtil } from '../Markdown/Markdown.Util.mjs';

const Imports = {
  Paragraph: () => import('../Markdown.Doc.Components/Doc.Paragraph'),
  Image: () => import('../Markdown.Doc.Components/Doc.Image'),
  Error: () => import('../Markdown.Doc.Components/Doc.Error'),
  Quote: () => import('../Markdown.Doc.Components/Doc.Quote'),
  Table: () => import('../Markdown.Doc.Components/Doc.Table'),
  Hr: () => import('../Markdown.Doc.Components/Doc.Hr'),
  OverlayTrigger: () => import('../Overlay/Overlay.TriggerPanel'),
};

/**
 * Default markdown to display (HTML, Component) renderer.
 */
export const defaultRenderer: t.MarkdownDocBlockRenderer = async (e) => {
  const { md, instance } = e;

  const asCtx = <T extends t.MdastNode>(node: T): t.DocBlockCtx<T> => ({ node, md });

  async function parseYamlOrError<T>(text: string) {
    try {
      const data = Text.Yaml.parse(text) as T;
      return { data };
    } catch (error: any) {
      console.error(error);
      const { DocError } = await Imports.Error();
      const msg = `Failed while parsing YAML within code block`;
      const element = <DocError message={msg} error={error} />;
      return { error: { element } };
    }
  }

  /**
   * Process <Image> with Component.
   */
  const imageNode = MarkdownUtil.find.image(e.node);
  if (imageNode) {
    const { DocImage } = await Imports.Image();

    const code = md.info.code.typed
      .filter((c) => c.type.startsWith('doc.image'))
      .filter((c) => c.type.includes(' id:'))[0];

    let def: t.DocImageDef | undefined;
    if (code && code.lang === 'yaml') {
      const res = await parseYamlOrError<t.DocImageDef>(code.text);
      if (res.error) return res.error.element;
      def = res.data;
    }

    return <DocImage ctx={asCtx(imageNode)} def={def} />;
  }

  /**
   * Code Block
   */
  if (e.node.type === 'code' && e.node.meta) {
    /**
     * Popout overlay triggers.
     */
    if (e.node.meta.startsWith('doc.overlay')) {
      const res = await parseYamlOrError<t.OverlayDef>(e.node.value);
      if (res.error) return res.error.element;
      const { OverlayTriggerPanel } = await Imports.OverlayTrigger();
      return <OverlayTriggerPanel instance={instance} def={res.data} />;
    }

    /**
     * No match on code-block
     * NB: Typed meta-code blocks not shown.
     */
    return null;
  }

  /**
   * Simple paragraph.
   */
  if (e.node.type === 'paragraph') {
    const { DocParagraph } = await Imports.Paragraph();
    return <DocParagraph ctx={asCtx(e.node)} />;
  }

  /**
   * Blockquote.
   */
  if (e.node.type === 'blockquote') {
    const { DocQuote } = await Imports.Quote();
    return <DocQuote ctx={asCtx(e.node)} />;
  }

  /**
   * HR (Horizontal Rule).
   */
  if (e.node.type === 'thematicBreak') {
    const { DocHr } = await Imports.Hr();
    return <DocHr ctx={asCtx(e.node)} />;
  }

  /**
   * Table
   */
  if (e.node.type === 'table') {
    const { DocTable } = await Imports.Table();
    return <DocTable ctx={asCtx(e.node)} />;
  }

  /**
   * Process raw HTML.
   */
  const text = md.toString(e.node.position);
  const { html } = await Processor.toHtml(text);
  return html;
};
