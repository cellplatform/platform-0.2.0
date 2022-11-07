import { Color, css, t, Text } from '../common.mjs';

const Processor = Text.Processor.markdown();

const styles = {
  image: css({ border: `solid 5px ${Color.format(-0.1)}` }),
};

/**
 * Default markdown to display (HTML, Component) renderer.
 */
export const renderer: t.MarkdownDocBlockRenderer = async (e) => {
  const { md } = e;
  const Markdown = Text.Markdown;

  /**
   * Process <Image> with Component.
   */
  const image = Markdown.Find.image(e.node);
  if (image) {
    const def = md.info.code.typed.find((c) => {
      return c.type.startsWith('doc.image') && c.type.includes(' id:');
    });

    const style: React.CSSProperties = {};

    /**
     * TODO 🐷
     */
    if (def && def.lang === 'yaml') {
      const o = Text.Yaml.parse(def.text);
      style.maxWidth = o.maxWidth;
    }

    const el = <img {...styles.image} style={style} src={image.url} alt={image.alt ?? ''} />;
    return el;
  }

  /**
   * Process raw HTML.
   */
  const text = md.toString(e.node.position);
  const { html } = await Processor.toHtml(text);
  return html;
};
