import { useEffect, useState } from 'react';

import { css, t } from '../common.mjs';
import { MarkdownEditor } from '../Markdown.Editor/index.mjs';
import { MarkdownOutline } from '../Markdown.Outline/index.mjs';
import { State } from '../../ui.logic/index.mjs';

export type MarkdownProps = {
  location: string;
  markdown: string;
  style?: t.CssValue;
};

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const show = State.QueryString.show(props.location);
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
      overflow: 'hidden',
    }),
    column: css({ flex: 1, display: 'flex' }),
  };

  const elements = show.map((kind, i) => {
    let el: JSX.Element | null = null;
    if (kind === 'editor') {
      el = (
        <MarkdownEditor
          key={i}
          markdown={markdown}
          onChange={onEditorChange}
          focusOnLoad={true}
          style={{ flex: 1 }}
        />
      );
    }
    if (kind === 'outline') {
      el = <MarkdownOutline markdown={markdown} scroll={true} style={{ flex: 1 }} />;
    }
    return (
      <div key={i} {...styles.column}>
        {el ?? null}
      </div>
    );
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};
