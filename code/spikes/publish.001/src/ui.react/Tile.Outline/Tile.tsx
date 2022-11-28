import { Color, COLORS, css, MarkdownUtil, t } from './common';
import { TileUtil } from './Util.mjs';

export type HeadingTileProps = {
  index: number;
  node: t.MdastHeading;
  siblings: { prev?: t.AstNode; next?: t.AstNode };
  selectedUrl?: string;
  style?: t.CssValue;
  widths?: { root?: number; child?: number };
  onClick?: t.TileClickHandler;
  renderTile?: t.RenderTileInner;
};

const toRef = (node: t.MdastNode): t.TileClickHandlerArgs['ref'] => {
  const match = MarkdownUtil.find.refLinks(node)[0];
  return match ? { text: match.text, url: match.url } : undefined;
};

export const HeadingTile: React.FC<HeadingTileProps> = (props) => {
  const { index, node, siblings, widths = {}, selectedUrl = '' } = props;
  const { title, children } = TileUtil.heading({ node, siblings });

  let isRootSelected = toRef(node)?.url === selectedUrl;
  if (!selectedUrl && props.index === 0) isRootSelected = true;

  const inner = (text: string, node: t.MdastNode) => {
    const res = props.renderTile?.({ index, text, node });
    return res ?? <div>{text}</div>;
  };

  /**
   * Handlers
   */
  const fireClick = (
    heading: t.TileClickHandlerArgs['heading'],
    child?: t.TileClickHandlerArgs['child'],
  ) => {
    let ref: t.TileClickHandlerArgs['ref'];
    if (child) ref = toRef(child.node);
    if (!child) ref = toRef(heading.node);
    props.onClick?.({ heading, child, ref });
  };

  const onRootClick: React.MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fireClick({ node, title });
  };

  // console.log('Wrangle.root.fontSize(widths.root)', Wrangle.root.fontSize(widths.root));

  /**
   * [Render]
   */
  const styles = {
    base: css({
      ':first-child': { marginTop: 0 },
      marginTop: 30,
      Flex: 'x-stretch-stretch',
    }),

    children: css({
      flex: 2,
      Flex: 'y-stretch-stretch',
      width: widths.child,
    }),

    block: {
      base: css({
        flex: children.length === 0 ? 1 : undefined,
        position: 'relative',
        boxSizing: 'border-box',
        cursor: 'default',
      }),
      root: css({
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: widths.root,
        fontSize: Wrangle.root.fontSize(widths.root),
        padding: Wrangle.root.padding(widths.root),
        paddingRight: 60,
        borderRadius: 10,
      }),
      title: css({}),
      child: css({
        marginTop: 10,
        ':first-child': { marginTop: 0 },
        padding: Wrangle.child.padding(widths.root),
        fontSize: Wrangle.child.fontSize(widths.root),
        marginLeft: 8,
        borderRadius: 8,
        overflow: 'hidden',
        lineHeight: '1.4em',
        Flex: 'y-start-center',
      }),

      /**
       * Block colors.
       */
      magenta: css({
        color: COLORS.WHITE,
        background: COLORS.MAGENTA,
        ':hover': { backgroundColor: Color.lighten(COLORS.DARK, 15) },
      }),

      silver: css({
        color: COLORS.DARK,
        border: `solid 1px ${Color.format(-0.1)}`,
        background: Color.alpha(COLORS.DARK, 0.1),
        ':hover': {
          backgroundColor: Color.lighten(COLORS.DARK, 15),
          color: COLORS.WHITE,
        },
      }),

      dark: css({
        color: COLORS.WHITE,
        background: Color.lighten(COLORS.DARK, 5),
        ':hover': { backgroundColor: Color.lighten(COLORS.DARK, 15) },
      }),

      selected: css({
        color: COLORS.WHITE,
        background: Color.lighten(COLORS.DARK, 15),
        ':hover': { backgroundColor: Color.lighten(COLORS.DARK, 15) },
      }),
    },
  };

  const elRootBlock = (
    <div
      {...css(
        styles.block.base,
        styles.block.root,
        styles.block.magenta,
        isRootSelected ? styles.block.selected : undefined,
      )}
    >
      <div {...styles.block.title}>{inner(title, node)}</div>
    </div>
  );

  const elChildren = children.length > 0 && (
    <div {...styles.children} className={'children'}>
      {children.map((child, i) => {
        const { depth, text } = child;

        let colors: t.CssValue | undefined;
        if (depth === 1) colors = styles.block.magenta;
        if (depth === 2) colors = styles.block.silver;
        if (depth === 3) colors = styles.block.dark;

        const url = toRef(child.node)?.url;
        const isChildSelected = url === selectedUrl;
        const selected = isChildSelected ? styles.block.selected : undefined;

        const onChildClick: React.MouseEventHandler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const heading = { node, title };
          fireClick(heading, { node: child.node, title: child.text });
        };

        return (
          <div
            {...css(styles.block.base, styles.block.child, colors, selected)}
            className={'child-block'}
            key={i}
            onClick={onChildClick}
          >
            {inner(text, child.node)}
          </div>
        );
      })}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)} onClick={onRootClick}>
      {elRootBlock}
      {elChildren}
    </div>
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  root: {
    fontSize(width?: number) {
      if (typeof width !== 'number') return 24;
      if (width >= 250) return 24;
      if (width >= 220) return 20;
      return 18;
    },
    padding(width?: number) {
      if (typeof width !== 'number') return 30;
      if (width >= 250) return 30;
      return 20;
    },
  },
  child: {
    fontSize(width?: number) {
      if (typeof width !== 'number') return 18;
      if (width >= 250) return 18;
      if (width >= 220) return 16;
      return 14;
    },
    padding(width?: number) {
      if (typeof width !== 'number') return 30;
      if (width >= 250) return 30;
      return 20;
    },
  },
};
