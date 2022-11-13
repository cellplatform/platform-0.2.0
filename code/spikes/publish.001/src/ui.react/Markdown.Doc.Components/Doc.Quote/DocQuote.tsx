import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC, Processor, DEFAULTS } from '../../common';

export type DocQuoteProps = {
  ctx: t.DocBlockCtx<t.MdastBlockquote>;
  markdown: string;
  style?: t.CssValue;
};

export const DocQuote: React.FC<DocQuoteProps> = (props) => {
  const [safeHtml, setSafeHtml] = useState('');

  /**
   * Lifecycle
   */
  useEffect(() => {
    (async () => {
      const res = await Processor.toHtml(props.markdown);
      setSafeHtml(res.html);
    })();
  }, [props.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      fontSize: 26,
      Margin: [80, 0],
      opacity: 0.7,
      lineHeight: '1.4em',
      letterSpacing: '-0.02em',
    }),
    quoteMark: css({
      Absolute: [45, null, null, 0],
      fontSize: 260,
      pointerEvents: 'none',
      userSelect: 'none',
      opacity: 0.06,
    }),
  };

  if (!safeHtml) return null;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.quoteMark}>{'“'}</div>
      {safeHtml && <div dangerouslySetInnerHTML={{ __html: safeHtml }} />}
    </div>
  );
};
