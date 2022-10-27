import { Color, COLORS, css, t, MarkdownUtil } from './common.mjs';
import { TileUtil } from './Tile.Util.mjs';

export type HeadingTileClickHandler = (e: HeadingTileClickHandlerArgs) => void;
export type HeadingTileClickHandlerArgs = {
  ref?: { text: string; url: string };
  heading: { node: t.MdastHeading; title: string };
  child?: {
    node: t.MdastListItem;
    title: string;
  };
};

export type HeadingTileProps = {
  index: number;
  node: t.MdastHeading;
  siblings: { prev?: t.AstNode; next?: t.AstNode };
  style?: t.CssValue;
  width?: number;
  onClick?: HeadingTileClickHandler;
};

export const HeadingTile: React.FC<HeadingTileProps> = (props) => {
  const { node, siblings, width } = props;
  const { title, children } = TileUtil.heading({ node, siblings });

  type A = HeadingTileClickHandlerArgs;
  const fireClick = (heading: A['heading'], child?: A['child']) => {
    let ref: A['ref'];
    const toRef = (node: t.MdastNode): A['ref'] => {
      const match = MarkdownUtil.find.refLinks(node)[0];
      return match ? { text: match.text, url: match.url } : undefined;
    };
    if (child) ref = toRef(child.node);
    if (!child) ref = toRef(heading.node);

    props.onClick?.({ heading, child, ref });
  };

  /**
   * Handlers
   */
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
        boxSizing: 'border-box',
        cursor: 'default',
        width,
      }),
      root: css({
        padding: 30,
        paddingRight: 60,
        borderRadius: 10,
        fontSize: 24,
      }),
      title: css({}),

      child: css({
        padding: 30,
        fontSize: 18,
        marginLeft: 8,
        borderRadius: 8,
        marginTop: 10,
        ':first-child': { marginTop: 0 },
      }),

      magenta: css({
        color: COLORS.WHITE,
        background: COLORS.MAGENTA,
        ':hover': { backgroundColor: Color.lighten(COLORS.DARK, 5) },
      }),

      dark: css({
        color: COLORS.WHITE,
        background: COLORS.DARK,
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
    },

    children: css({
      flex: 2,
      Flex: 'y-stretch-stretch',
    }),
  };

  const elRootBlock = (
    <div {...css(styles.block.base, styles.block.root, styles.block.magenta)}>
      <div {...styles.block.title}>{title}</div>
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

        const onChildClick: React.MouseEventHandler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const heading = { node, title };
          fireClick(heading, { node: child.node, title: child.text });
        };

        return (
          <div
            key={i}
            {...css(styles.block.base, styles.block.child, colors)}
            onClick={onChildClick}
          >
            {text}
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
