import { css, t } from '../common';
import { Icons } from '../Icons.mjs';
import { TileOutline } from '../Tile.Outline/index.mjs';

export type MarkdownLayoutOutlineProps = {
  markdown?: string;
  selectedUrl?: string;
  style?: t.CssValue;
  onSelectClick?: t.TileClickHandler;
};

export const MarkdownLayoutOutline: React.FC<MarkdownLayoutOutlineProps> = (props) => {
  const styles = {
    footerSpacer: css({ height: 40 }),
  };

  return (
    <div>
      <TileOutline
        style={props.style}
        widths={{ root: 250, child: 300 }}
        markdown={props.markdown}
        selectedUrl={props.selectedUrl}
        onClick={props.onSelectClick}
        renderTile={(e) => {
          const isRoot = !e.text && e.index === 0 && e.node.type === 'heading';
          return isRoot ? <RootInner /> : null;
        }}
      />
      <div {...styles.footerSpacer}> </div>
    </div>
  );
};

/**
 * [Helpers]
 */

function RootInner() {
  const styles = {
    base: css({
      Absolute: [null, 0, 35, 0],
      Flex: 'x-center-center',
    }),
  };

  return (
    <div {...styles.base}>
      <Icons.Book size={70} color={1} />
    </div>
  );
}
