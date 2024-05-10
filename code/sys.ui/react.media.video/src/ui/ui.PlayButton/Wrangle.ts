import { COLORS, Color, DEFAULTS, Icons, type t } from './common';

export const Wrangle = {
  isPlaying(props: t.PlayButtonProps) {
    const { status = DEFAULTS.status, spinning = DEFAULTS.spinning } = props;
    return status === 'Pause' || spinning;
  },

  icon(status: t.PlayButtonStatus) {
    if (status === 'Play') return Icons.Play;
    if (status === 'Pause') return Icons.Pause;
    if (status === 'Replay') return Icons.Replay;
    return undefined;
  },

  sizes(props: { size?: t.PlayButtonSize }) {
    const { size = DEFAULTS.size } = props;
    let icon = 22;
    let width = 56;
    let height = 32;
    let spinner = 20;
    if (size === 'Small') {
      icon = 15;
      width = 38;
      height = 20;
      spinner = 16;
    }
    if (size === 'Large') {
      icon = 28;
      width = 80;
      height = 38;
      spinner = 28;
    }
    return { icon, width, height, spinner } as const;
  },

  buttonColors(props: t.PlayButtonProps, options: { isOver?: boolean }) {
    const isPlaying = Wrangle.isPlaying(props);
    const { enabled = DEFAULTS.enabled } = props;
    const { isOver = false } = options;
    const isActive = enabled && (isOver || isPlaying);

    let backgroundColor = Color.alpha(COLORS.DARK, 0.1);
    if (enabled && isPlaying) {
      backgroundColor = COLORS.BLUE;
    } else {
      if (enabled && isOver) backgroundColor = Color.alpha(COLORS.DARK, 0.6);
    }

    const iconColor = isActive ? COLORS.WHITE : COLORS.DARK;
    const borderColor = Color.alpha(COLORS.DARK, 0.08);
    return {
      backgroundColor,
      borderColor,
      iconColor,
    } as const;
  },

  clickArgs(status: t.PlayButtonStatus): t.PlayButtonClickHandlerArgs {
    const play = status === 'Play';
    const pause = status === 'Pause';
    const replay = status === 'Replay';
    const playing = (play || replay) && !pause;
    const is = { playing, paused: !playing };
    return { status, play, pause, replay, is };
  },
} as const;
