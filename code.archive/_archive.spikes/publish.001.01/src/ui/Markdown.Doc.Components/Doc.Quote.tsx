import { useEffect, useState } from 'react';
import { css, Processor, t } from '../common';

export type DocQuoteProps = {
  ctx: t.DocBlockCtx<t.MdastBlockquote>;
  style?: t.CssValue;
};

export const DocQuote: React.FC<DocQuoteProps> = (props) => {
  const { ctx } = props;
  const markdown = ctx.md.toString(ctx.node.position);
  const depth = Wrangle.depth(markdown);

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
    base: css({
      position: 'relative',
      fontSize: 26,
      Margin: [70, 60],
      opacity: 0.7,
      lineHeight: '1.4em',
      letterSpacing: '-0.01em',
    }),
    quoteMark: css({
      Absolute: [45, null, null, -53],
      fontSize: 260,
      pointerEvents: 'none',
      userSelect: 'none',
      opacity: 0.06,
    }),
  };

  if (!safeHtml) return null;

  return (
    <div {...css(styles.base, props.style)}>
      {depth === 1 && <div {...styles.quoteMark}>{'“'}</div>}
      {safeHtml && <div dangerouslySetInnerHTML={{ __html: safeHtml }} />}
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  depth(markdown: string) {
    const match = markdown.match(/^>*/);
    return match === null || !match[0] ? 0 : match[0].length;
  },
};
