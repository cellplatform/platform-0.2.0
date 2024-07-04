import { COLORS, Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const style: Required<t.DevTitleStyle> = {
  color: COLORS.DARK,
  margin: [0, 0, 6, 0],
  size: 14,
  bold: true,
  italic: false,
  ellipsis: true,
  opacity: 1,
};

export const DEFAULTS = {
  displayName: `${Pkg.name}:DevTools.Title`,
  title: 'Untitled',
  style,
} as const;
