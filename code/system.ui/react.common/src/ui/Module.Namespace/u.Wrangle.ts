import { DEFAULTS, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  is(props: t.ModuleNamespaceProps) {
    const theme = Wrangle.theme(props);
    const is = { dark: theme === 'Dark', light: theme === 'Light' } as const;
    return is;
  },

  theme(props: t.ModuleNamespaceProps) {
    const { theme = DEFAULTS.theme } = props;
    return theme;
  },
} as const;
