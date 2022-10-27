import { useEffect, useState } from 'react';

import { Color, css, t } from '../common.mjs';
import { MarkdownEditor } from '../Markdown.Editor/index.mjs';
import { MarkdownOutline } from '../Markdown.Outline/index.mjs';
import { State } from '../../ui.logic/index.mjs';
import { MarkdownDoc } from '../Markdown.Doc/index.mjs';

export type MarkdownProps = {
  location: string;
  markdown: string;
  data: t.StateMarkdown;
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
    column: css({ display: 'flex' }),
  };

  const elements = show.map((kind, i) => {
    let el: JSX.Element | null = null;

    let flex: undefined | number;

    // if (kind === 'outline' || kind ===)

    if (kind === 'outline') {
      flex = undefined;
      el = <MarkdownOutline markdown={markdown} scroll={true} style={{ flex: 1, padding: 40 }} />;
    }

    if (kind === 'doc') {
      flex = 2;
      el = <MarkdownDoc markdown={markdown} scroll={true} style={{ flex: 1 }} />;
    }

    if (kind === 'editor') {
      flex = 1;
      el = (
        <MarkdownEditor
          key={i}
          style={{ flex: 1 }}
          markdown={markdown}
          onChange={onEditorChange}
          focusOnLoad={true}
        />
      );
    }

    return (
      <div key={i} {...css(styles.column, { flex })}>
        {el ?? null}
      </div>
    );
  });

  return <div {...css(styles.base, props.style)}>{elements}</div>;
};
