import { useEffect, useState } from 'react';

import { css, Processor, t } from './common';
import { HeadingTile } from './Tile';

export type TileOutlineProps = {
  markdown?: string;
  selectedUrl?: string;
  widths?: { root?: number; child?: number };
  style?: t.CssValue;
  onClick?: t.TileClickHandler;
  renderTile?: t.RenderTileInner;
};

export const TileOutline: React.FC<TileOutlineProps> = (props) => {
  const rootWidth = props.widths?.root ?? 0;
  const childWidth = props.widths?.child ?? 0;

  const [mdast, setMdast] = useState<t.MdastRoot | undefined>();

  useEffect(() => {
    Processor.toMarkdown(props.markdown).then((md) => setMdast(md.mdast));
  }, [props.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      userSelect: 'none',
      width: props.widths ? rootWidth + childWidth : undefined,
    }),
  };

  const children = mdast?.children ?? [];
  const elBlocks: JSX.Element[] = [];

  let i = -1;
  for (const node of mdast?.children || []) {
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
          renderTile={props.renderTile}
        />
      );
      elBlocks.push(el);
    }
  }

  return (
    <div className={'TileOutline'} {...css(styles.base, props.style)}>
      {elBlocks}
    </div>
  );
};
