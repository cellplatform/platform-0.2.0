import React, { useEffect, useRef, useState } from 'react';

import { COLORS, css, FC, t, MarkdownUtil } from './common.mjs';

import { MarkdownOutlineRootSection } from './Markdown.Outline.RootSection';

export type MarkdownOutlineProps = {
  markdown?: string;
  style?: t.CssValue;
};

export const MarkdownOutline: React.FC<MarkdownOutlineProps> = (props) => {
  const [ast, setAst] = useState<t.MdastRoot | undefined>();

  useEffect(() => {
    (async () => {
      const { ast } = await MarkdownUtil.parseMarkdown(props.markdown ?? '');
      setAst(ast);
    })();
  }, [props.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      Padding: [40, 50],
      minWidth: 450,
      maxWidth: 600,
    }),
    header: css({
      marginBottom: 50,
      overflow: 'hidden',
    }),
    block: css({
      padding: 30,
      background: COLORS.MAGENTA,
      color: COLORS.WHITE,
      borderRadius: 10,
      marginTop: 20,
      ':first-child': { marginTop: 0 },
      ':hover': {
        backgroundColor: 'rgba(255, 0, 0, 0.5)' /* RED */,
      },
    }),
    blockHeader: css({ fontSize: 32 }),
  };

  const children = ast?.children ?? [];
  const elBlocks = ast?.children
    .filter((node) => node.type === 'heading')
    .map((node, i) => {
      const heading = node as t.MdastHeading;
      const prev = children[i - 0] as t.MdastHeading;
      const next = children[i + 1] as t.MdastHeading;
      const siblings = { prev, next };

      const el = (
        <MarkdownOutlineRootSection key={i} index={i} node={heading} siblings={siblings} />
      );
      return el;
    });

  return (
    <div {...css(styles.base, props.style)}>
      <div>{elBlocks}</div>
    </div>
  );
};
