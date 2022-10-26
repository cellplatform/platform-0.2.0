import { useEffect, useState } from 'react';

import { css, FC, MarkdownUtil, t } from './common.mjs';
import { HeadingTile } from './Tile.Heading';

export type MarkdownOutlineProps = {
  markdown?: string;
  scroll?: boolean;
  style?: t.CssValue;
};

export const MarkdownOutline: React.FC<MarkdownOutlineProps> = (props) => {
  const [ast, setAst] = useState<t.MdastRoot | undefined>();

  useEffect(() => {
    (async () => {
      const { info } = await MarkdownUtil.parseMarkdown(props.markdown);
      setAst(info.ast);
    })();
  }, [props.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Scroll: props.scroll,
      boxSizing: 'border-box',
      Padding: 40,
      minWidth: 450,
      maxWidth: 550,
    }),
    body: css({}),
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
