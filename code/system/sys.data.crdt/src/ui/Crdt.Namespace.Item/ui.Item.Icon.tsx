import { Button, COLORS, Icons, css, type t } from './common';

export type ItemIconProps = {
  action: t.CrdtNsItemActionKind;
  color?: string | number;
  opacity?: number;
  enabled?: boolean;
  width?: number;
  button?: boolean;
  style?: t.CssValue;
  onClick?: t.CrdtNamespaceItemClickHandler;
};

export const Icon: React.FC<ItemIconProps> = (props) => {
  const { action, width, opacity, enabled = true } = props;
  const isButton = props.button && props.onClick && enabled;

  /**
   * [Handlers]
   */
  const onClick = () => {
    props.onClick?.({ actions: [action] });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ opacity, width, display: 'grid', placeItems: 'center' }),
    button: css({ display: 'grid', placeItems: 'center' }),
  };

  const elIcon = Wrangle.icon(props);
  const elButton = isButton && (
    <Button onClick={onClick} isEnabled={enabled}>
      <div {...styles.button}>{elIcon}</div>
    </Button>
  );

  return <div {...css(styles.base, props.style)}>{elButton || elIcon}</div>;
};

/**
 * Helpers
 */
const Wrangle = {
  icon(props: ItemIconProps) {
    const { action: kind, color = COLORS.DARK } = props;

    if (kind === 'Repo') {
      return <Icons.Repo size={18} color={color} offset={[0, 1]} />;
    }
    if (kind === 'Json') {
      return <Icons.Json size={17} color={color} />;
    }
    if (kind === 'ObjectTree') {
      return <Icons.ObjectTree size={17} color={color} />;
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

    return null;
  },
};
