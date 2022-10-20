import React, { useEffect, useState } from 'react';

import { css, t } from '../common.mjs';
import { MarkdownEditor } from './Markdown.Editor';
import { MarkdownOutline } from './Markdown.Outline';
import { State } from '../state/index.mjs';

export type ShowMarkdownComponent = 'editor' | 'outline';

export type MarkdownProps = {
  location: URL;
  markdown: string;
  style?: t.CssValue;
};

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const { location } = props;
  const show = State.QueryString.show(location);
  const [markdown, setMarkdown] = useState('');

  /**
   * Lifecycle.
   */
  useEffect(() => {
    setMarkdown(props.markdown);
  }, [props.markdown]);

  /**
   * Handlers
   */
  const onEditorChange = (e: { text: string }) => {
    setMarkdown(e.text);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      Flex: 'x-stretch-stretch',
      fontSize: 16,
    }),
    column: css({ flex: 1 }),
  };

  const elements = show.map((kind, i) => {
    let el: JSX.Element | null = null;
    if (kind === 'editor') {
      el = <MarkdownEditor key={i} md={markdown} onChange={onEditorChange} />;
    }
    if (kind === 'outline') {
      el = <MarkdownOutline markdown={markdown} />;
    }
    return (
      <div key={i} {...styles.column}>
        {el ?? null}
      </div>
    );
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};
