import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common/index.mjs';
import { Text } from 'sys.text';

export type MarkdownProps = { style?: t.CssValue };

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    (async () => {
      // const url = 'https://undb.db.team/data.md/2.core-narratives/perspective-shift.md';
      const url = '/data.md/2.core-narratives/perspective-shift.md';

      const res = await fetch(url);

      console.log('res', res);
      const text = await res.text();
      console.log('text', text);

      const md = await Text.Processor.markdown().toHtml(text);
      console.log('md', md);
      setHtml(md.html);

      console.log('md.info', md.info);
    })();
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      padding: 10,
    }),
  };

  const elHtml = html && <div dangerouslySetInnerHTML={{ __html: html }} />;

  return <div {...css(styles.base, props.style)}>{elHtml}</div>;
};
