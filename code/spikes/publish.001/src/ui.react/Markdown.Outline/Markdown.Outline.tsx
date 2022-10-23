import { useEffect, useState } from 'react';

import { css, FC, MarkdownUtil, t } from './common.mjs';
import { HeadingTile } from './Tile.Heading';

export type MarkdownOutlineProps = {
  markdown?: string;
  style?: t.CssValue;
};

export const MarkdownOutline: React.FC<MarkdownOutlineProps> = (props) => {
  const [ast, setAst] = useState<t.MdastRoot | undefined>();

  useEffect(() => {
    (async () => {
      const { ast } = await MarkdownUtil.parseMarkdown(props.markdown);
      setAst(ast);
    })();
  }, [props.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      Scroll: true,
      Padding: [40, 50],
      flex: 1,
    }),
    body: css({
      minWidth: 450,
      maxWidth: 550,
    }),
  };

  const children = ast?.children ?? [];
  const elBlocks: JSX.Element[] = [];

  let i = -1;
  for (const node of ast?.children || []) {
    i++;
    if (node.type === 'heading') {
      const heading = node as t.MdastHeading;
      const prev = children[i - 0] as t.MdastHeading;
      const next = children[i + 1] as t.MdastHeading;
      const siblings = { prev, next };
      const el = (
        <HeadingTile
          key={i}
          index={i}
          node={heading}
          siblings={siblings}
          onClick={(e) => {
            console.log('HeadingTile/click:', e); // TEMP 🐷
          }}
        />
      );
      elBlocks.push(el);
    }
  }

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <div>{elBlocks}</div>
      </div>
    </div>
  );
};
