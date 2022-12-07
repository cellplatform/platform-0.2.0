import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC, Processor } from '../common';

export type DocParagraphProps = {
  ctx: t.DocBlockCtx<t.MdastParagraph>;
  style?: t.CssValue;
};

export const DocParagraph: React.FC<DocParagraphProps> = (props) => {
  const { ctx } = props;
  const markdown = ctx.md.toString(ctx.node.position);
  const isFirst = isFirstParagraph(ctx);

  const [safeHtml, setSafeHtml] = useState('');

  /**
   * Lifecycle
   */
  useEffect(() => {
    Processor.toHtml(markdown).then(({ html }) => setSafeHtml(html));
  }, [markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
  };
  return (
    <div {...css(styles.base, props.style)}>
      {safeHtml && <div dangerouslySetInnerHTML={{ __html: safeHtml }} />}
    </div>
  );
};

/**
 * Helpers
 */
function isFirstParagraph(ctx: t.DocBlockCtx<t.MdastParagraph>) {
  const first = ctx.md.mdast.children.find((node) => node.type === 'paragraph');
  return ctx.node === first;
}
