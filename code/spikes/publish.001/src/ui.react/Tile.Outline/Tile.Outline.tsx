import { useEffect, useState } from 'react';

import { css, MarkdownUtil, t } from './common';
import { HeadingTile } from './Tile.Heading';

import type { HeadingTileClickHandler } from './Tile.Heading';
export type { HeadingTileClickHandler };

export type TileOutlineProps = {
  markdown?: string;
  selectedUrl?: string;
  scroll?: boolean;
  widths?: { root?: number; child?: number };
  style?: t.CssValue;
  onClick?: HeadingTileClickHandler;
};

export const TileOutline: React.FC<TileOutlineProps> = (props) => {
  const [ast, setAst] = useState<t.MdastRoot | undefined>();

  useEffect(() => {
    (async () => {
      const { info } = await MarkdownUtil.parseMarkdown(props.markdown);
      setAst(info.mdast);
    })();
  }, [props.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Scroll: props.scroll,
      userSelect: 'none',
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
          selectedUrl={props.selectedUrl}
          onClick={props.onClick}
          widths={props.widths}
        />
      );
      elBlocks.push(el);
    }
  }

  return <div {...css(styles.base, props.style)}>{elBlocks}</div>;
};
