import { css, t } from '../common';
import { Icons } from '../Icons.mjs';
import { TileOutline } from '../Tile.Outline';

export type MarkdownLayoutOutlineProps = {
  parentSize?: t.DomRect;
  markdown?: string;
  selectedUrl?: string;
  style?: t.CssValue;
  onSelectClick?: t.TileClickHandler;
};

export const MarkdownLayoutOutline: React.FC<MarkdownLayoutOutlineProps> = (props) => {
  const { parentSize } = props;
  const widths = Wrangle.widths(parentSize);

  /**
   * [Render]
   */
  const styles = {
    base: css({}),
    footerSpacer: css({ height: 40 }),
  };

  const elOutline = widths.root > 0 && (
    <TileOutline
      style={props.style}
      widths={widths}
      markdown={props.markdown}
      selectedUrl={props.selectedUrl}
      onClick={props.onSelectClick}
      renderTile={(e) => {
        const isRoot = !e.text.trim() && e.index === 0 && e.node.type === 'heading';
        return isRoot ? <RootInner parentSize={parentSize} /> : null;
      }}
    />
  );

  return (
    <div {...styles.base}>
      {elOutline}
      <div {...styles.footerSpacer} />
    </div>
  );
};

/**
 * [Helpers]
 */

function RootInner(props: { parentSize?: t.DomRect }) {
  const size = Wrangle.iconSize(props.parentSize);
  const bottom = size > 50 ? 35 : 20;
  const styles = {
    base: css({
      Absolute: [null, 0, bottom, 0],
      Flex: 'x-center-center',
    }),
  };
  return (
    <div {...styles.base}>
      <Icons.Book size={size} color={1} />
    </div>
  );
}

const Wrangle = {
  widths(parentSize?: t.DomRect) {
    const width = parentSize?.width;
    if (typeof width !== 'number' || width <= 0) return { root: 0, child: 0 };
    if (width >= 1370) return { root: 250, child: 300 };
    if (width >= 1310) return { root: 200, child: 270 };
    return { root: 182, child: 210 };
  },

  iconSize(parentSize?: t.DomRect) {
    const width = parentSize?.width;
    if (typeof width !== 'number' || width <= 0) return 70;
    if (width >= 1350) return 70;
    return 50;
  },
};
