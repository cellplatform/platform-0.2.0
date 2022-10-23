import { Color, COLORS, css, t } from './common.mjs';
import { TileUtil } from './TileUtil.mjs';

export type HeadingTileClickHandler = (e: HeadingTileClickHandlerArgs) => void;
export type HeadingTileClickHandlerArgs = { node: t.MdastHeading };

export type HeadingTileProps = {
  index: number;
  node: t.MdastHeading;
  siblings: { prev?: t.AstNode; next?: t.AstNode };
  style?: t.CssValue;
  onClick?: HeadingTileClickHandler;
};

export const HeadingTile: React.FC<HeadingTileProps> = (props) => {
  const { node, siblings } = props;
  const { title, children } = TileUtil.heading({ node, siblings });

  /**
   * Handlers
   */
  const onRootClick: React.MouseEventHandler = (e) => {
    e.preventDefault();
    props.onClick?.({ node });
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
      }),
      root: css({
        padding: 30,
        paddingRight: 60,
        borderRadius: 10,
        fontSize: 24,
      }),

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
      <div>{title}</div>
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

        return (
          <div key={i} {...css(styles.block.base, styles.block.child, colors)}>
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
