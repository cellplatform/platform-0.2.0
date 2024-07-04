import { COLORS, Pkg, type t, DEFAULTS as BASE } from '../common';
export * from '../common';

/**
 * Constants
 */
const style: Required<t.DevTodoStyle> = {
  color: COLORS.DARK,
  margin: [6, 0, 6, 0],
};

export const DEFAULTS = {
  displayName: `${Pkg.name}:DevTools.Todo`,
  style,
  md: BASE.md,
} as const;
