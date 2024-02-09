import { COLORS, DEFAULTS, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  is(props: t.ModuleLoaderProps) {
    const theme = Wrangle.theme(props);
    const is = { dark: theme === 'Dark', light: theme === 'Light' } as const;
    return is;
  },

  theme(props: t.ModuleLoaderProps) {
    const { theme = DEFAULTS.theme } = props;
    return theme;
  },

  spinning(
    props: t.ModuleLoaderProps,
    ensure: boolean = false,
  ): t.ModuleLoaderSpinning | undefined {
    const format = (res: t.ModuleLoaderSpinning) => {
      const theme = Wrangle.theme(props);
      const color = res.color ? res.color : theme === 'Dark' ? COLORS.WHITE : COLORS.BLACK;
      return { ...res, color };
    };
    if (props.spinning === true) {
      return format(DEFAULTS.spinning);
    }
    if (typeof props.spinning === 'object') {
      return format({ ...DEFAULTS.spinning, ...props.spinning });
    }
    return ensure ? format(DEFAULTS.spinning) : undefined;
  },
} as const;
