import { Color, type t } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  color(props: { theme?: t.CommonTheme; color?: string | number }) {
    return props.color ? Color.format(props.color) : Color.fromTheme(props.theme);
  },
} as const;
