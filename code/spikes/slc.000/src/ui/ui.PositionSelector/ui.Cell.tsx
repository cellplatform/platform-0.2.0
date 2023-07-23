import { Wrangle } from './Wrangle.mjs';
import { COLORS, Color, DEFAULTS, css, type t } from './common';

export type CellProps = {
  enabled?: boolean;
  position: t.Position;
  selected?: boolean;
  style?: t.CssValue;
  onClick: t.PositionClickHandler;
};

export const Cell: React.FC<CellProps> = (props) => {
  const { position, selected, enabled = DEFAULTS.enabled } = props;
  const { x, y } = position;
  const pos = Wrangle.pos(position);

  /**
   * Handlers
   */
  const onClick = () => {
    if (!enabled) return;
    props.onClick?.({ position, pos });
  };

  /**
   * [Render]
   */
  const backgroundColor = selected
    ? enabled
      ? COLORS.BLUE
      : Color.alpha(COLORS.DARK, 0.1)
    : undefined;

  const styles = {
    base: css({
      backgroundColor,
      userSelect: 'none',
      cursor: enabled ? 'pointer' : undefined,
      border: `solid 0.5px ${Color.alpha(COLORS.DARK, 0.15)}`,
    }),
  };

  return <div {...css(styles.base, props.style)} onMouseDown={onClick} />;
};
