import { COLORS, Icons, css, type t } from './common';

export type ItemIconProps = {
  kind: 'Repo' | 'Editing' | 'Json' | 'ObjectTree';
  color?: string | number;
  opacity?: number;
  width?: number;
  style?: t.CssValue;
};

export const ItemIcon: React.FC<ItemIconProps> = (props) => {
  const { opacity = 1, width } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      placeItems: 'center',
      opacity,
      width,
    }),
  };

  return <div {...css(styles.base, props.style)}>{Wrangle.icon(props)}</div>;
};

/**
 * Helpers
 */
const Wrangle = {
  icon(props: ItemIconProps) {
    const { kind, color = COLORS.DARK } = props;

    if (kind === 'Repo') {
      return <Icons.Repo size={18} color={color} offset={[0, 1]} />;
    }
    if (kind === 'Editing') {
      return (
        <Icons.Editing
          size={16}
          color={color}
          offset={[0, 0]}
          style={{ transform: `scaleX(-1)` }}
        />
      );
    }
    if (kind === 'Json') {
      return <Icons.Json size={17} color={color} />;
    }
    if (kind === 'ObjectTree') {
      return <Icons.ObjectTree size={17} color={color} />;
    }

    return null;
  },
};
