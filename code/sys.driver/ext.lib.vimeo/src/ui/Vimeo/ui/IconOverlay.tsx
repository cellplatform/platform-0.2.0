import { COLORS, Color, Icons, css, type t } from '../common';

export type IconOverlayProps = {
  icon?: t.VimeoIconFlag;
  style?: t.CssValue;
  onClick?: (e: t.VimeoIconClickArgs) => void;
};

export const IconOverlay: React.FC<IconOverlayProps> = (props) => {
  const { icon, onClick } = props;
  const iconSize = 48;

  if (!icon) return null;

  const styles = {
    base: css({
      Absolute: 0,
      Flex: 'center-center',
      pointerEvents: 'none',
    }),
    container: css({
      Flex: 'center-center',
      width: iconSize + 40,
      height: iconSize + 40,
      backgroundColor: Color.format(0.3),
      backdropFilter: `blur(8px)`,
      borderRadius: 8,
      pointerEvents: 'auto',
      cursor: onClick ? 'pointer' : 'default',
    }),
  };

  const Icon = (() => {
    if (icon === 'play') return Icons.Player.PlayCircle;
    if (icon === 'pause') return Icons.Player.Pause;
    if (icon === 'replay') return Icons.Player.Replay;
    return;
  })();

  const elIcon = Icon && <Icon size={iconSize} color={COLORS.DARK} opacity={0.6} />;
  // const elSpinner = icon === 'spinner' && <Spinner size={32} color={COLORS.DARK} />;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.container} onClick={() => props.onClick?.({ icon })}>
        {elIcon}
        {/* {elSpinner} */}
      </div>
    </div>
  );
};
