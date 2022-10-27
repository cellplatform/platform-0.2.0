import { useEffect, useRef, useState } from 'react';

import { css, FC, t } from '../common.mjs';
import { MarkdownUtil } from '../Markdown/Markdown.Util.mjs';

export type MarkdownDocProps = {
  markdown?: string;
  scroll?: boolean;
  style?: t.CssValue;
};

export const MarkdownDoc: React.FC<MarkdownDocProps> = (props) => {
  const [safeHtml, setSafeHtml] = useState('');
  const isEmpty = !Boolean(safeHtml);

  /**
   * Lifecycle
   */
  useEffect(() => {
    (async () => {
      const markdown = (props.markdown || '').trim();
      if (markdown) {
        const res = await MarkdownUtil.parseHtml(markdown);
        setSafeHtml(res.html.trim());
      }
    })();
  }, [props.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Scroll: props.scroll,
    }),
    empty: css({
      marginTop: 30,
      textAlign: 'center',
      opacity: 0.3,
      fontSize: 13,
      fontStyle: 'italic',
    }),
    html: css({
      // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  const elEmpty = isEmpty && <div {...styles.empty}>Nothing to display</div>;
  const elHtml = <div {...styles.html} dangerouslySetInnerHTML={{ __html: safeHtml }} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elHtml}
    </div>
  );
};
