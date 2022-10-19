import React, { useEffect, useState } from 'react';

import { css, t } from '../common.mjs';
import { MarkdownEditor } from './Markdown.Editor';
import { MarkdownOutline } from './Markdown.Outline';

export type MarkdownProps = { markdown: string; style?: t.CssValue };

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    setMarkdown(props.markdown);
  }, [props.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      Flex: 'x-stretch-stretch',
      fontSize: 16,
    }),
    left: css({ flex: 1 }),
    right: css({ flex: 1 }),
  };

  const elEditor = <MarkdownEditor md={markdown} onChange={(e) => setMarkdown(e.text)} />;
  const elOutline = <MarkdownOutline markdown={markdown} />;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>{elEditor}</div>
      <div style={{ width: 20 }} />
      <div {...styles.right}>{elOutline}</div>
    </div>
  );
};
