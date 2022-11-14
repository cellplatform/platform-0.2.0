import { Color, COLORS, css, MarkdownUtil, t } from './common';
import { TileUtil } from './Tile.Util.mjs';

export type HeadingTileProps = {
  index: number;
  node: t.MdastHeading;
  siblings: { prev?: t.AstNode; next?: t.AstNode };
  selectedUrl?: string;
  style?: t.CssValue;
  widths?: { root?: number; child?: number };
  onClick?: t.TileClickHandler;
  renderInner?: t.RenderTileInner;
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
    const res = props.renderInner?.({ index, text, node });
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

  /**
   * [Render]
   */
  const styles = {
    base: css({
      marginTop: 30,
      ':first-child': { marginTop: 0 },
      Flex: 'x-stretch-stretch',
    }),

    block: {
      base: css({
        flex: 1,
        position: 'relative',
        boxSizing: 'border-box',
        cursor: 'default',
        width: widths.root,
      }),
      root: css({
        position: 'relative',
        overflow: 'hidden',
        padding: 30,
        paddingRight: 60,
        borderRadius: 10,
        fontSize: 24,
      }),
      title: css({}),

      child: css({
        marginTop: 10,
        ':first-child': { marginTop: 0 },
        padding: 30,
        fontSize: 18,
        marginLeft: 8,
        borderRadius: 8,
        overflow: 'hidden',
        width: widths.child,
        Flex: 'y-start-center',
      }),

      /**
       * Block colors.
       */
      magenta: css({
        color: COLORS.WHITE,
        background: COLORS.MAGENTA,
        ':hover': { backgroundColor: Color.lighten(COLORS.DARK, 5) },
      }),

      silver: css({
        color: COLORS.DARK,
        border: `solid 1px ${Color.format(-0.1)}`,
        background: Color.alpha(COLORS.DARK, 0.1),
        ':hover': {
          backgroundColor: Color.lighten(COLORS.DARK, 5),
          color: COLORS.WHITE,
        },
      }),

      dark: css({
        color: COLORS.WHITE,
        background: COLORS.DARK,
        ':hover': { backgroundColor: Color.lighten(COLORS.DARK, 5) },
      }),

      selected: css({
        color: COLORS.WHITE,
        background: COLORS.DARK,
        ':hover': { backgroundColor: Color.lighten(COLORS.DARK, 5) },
      }),
    },

    children: css({
      flex: 2,
      Flex: 'y-stretch-stretch',
    }),
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
    <div {...styles.children}>
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
