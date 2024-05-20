import { css, DEFAULTS, Spinner, useMouse, type t } from './common';
import { Wrangle } from './u';

export const View: React.FC<t.PlayButtonProps> = (props) => {
  const {
    status = DEFAULTS.status,
    enabled = DEFAULTS.enabled,
    spinning = DEFAULTS.spinning,
    size = DEFAULTS.size,
  } = props;
  const Icon = Wrangle.icon(status);

  const mouse = useMouse({
    onDown(e) {
      if (enabled) props.onClick?.(Wrangle.clickArgs(status));
    },
  });
  const { is } = mouse;
  const isOver = is.over;

  /**
   * [Render]
   */
  const sizes = Wrangle.sizes(props);
  const { backgroundColor, borderColor, iconColor } = Wrangle.buttonColors(props, { isOver });
  const styles = {
    base: css({
      backgroundColor,
      transition: 'background-color 0.15s',
      border: `solid 1px ${borderColor}`,
      borderRadius: 4,
      boxSizing: 'border-box',
      width: sizes.width,
      height: sizes.height,
      cursor: enabled ? 'pointer' : 'default',
      display: 'grid',
    }),
    body: css({
      display: 'grid',
      placeItems: 'center',
      transform: is.down && enabled ? 'translateY(1px)' : undefined,
      opacity: enabled ? 1 : 0.5,
      transition: 'opacity 0.15s',
    }),
  };

  const elIcon = Icon && !spinning && <Icon size={sizes.icon} color={iconColor} />;
  const elSpinner = spinning && <Spinner.Bar color={iconColor} width={sizes.spinner} />;

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <div {...styles.body}>
        {elIcon}
        {elSpinner}
      </div>
    </div>
  );
};
