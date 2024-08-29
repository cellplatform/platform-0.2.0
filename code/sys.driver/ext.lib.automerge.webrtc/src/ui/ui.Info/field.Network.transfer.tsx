import { COLORS, Color, Filesize, Icons, css, type t } from './common';
type TBytes = { in: number; out: number };

/**
 * Network data transfer.
 */
export function transfer(ctx: t.InfoCtx, bytes: TBytes, isTransmitting?: boolean) {
  const total = bytes.in + bytes.out;
  const label = total === 0 ? '' : wrangle.label(bytes);

  const theme = Color.theme(ctx.theme);
  const styles = {
    center: css({ Flex: 'x-center-center' }),
    iconRight: css({
      marginLeft: 5,
      color: isTransmitting ? COLORS.BLUE : theme.fg,
      opacity: total > 0 || isTransmitting ? 1 : 0.3,
      transition: 'opacity 0.2s, color 0.2s',
    }),
    label: css({
      opacity: total === 0 ? 0.3 : 1,
      transition: 'opacity 0.2s',
    }),
  };

  return {
    label: 'Network Data',
    value: (
      <div {...styles.center}>
        <div {...styles.label}>{label}</div>
        <Icons.Antenna size={14} style={styles.iconRight} />
      </div>
    ),
  };
}

/**
 * Helpers
 */
const wrangle = {
  label(bytes: TBytes) {
    const human = (bytes: number) => Filesize(bytes);
    return `↓${human(bytes.in)}, ↑${human(bytes.out)}`;
  },
} as const;
