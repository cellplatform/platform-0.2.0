import { Pkg, type t } from '../common';

export { Button } from '../Button';
export { Chip } from '../Chip';
export { Icons } from '../Icons';
export { Spinner } from '../Spinner';
export * from '../common';

/**
 * Constants
 */
const theme: t.CommonTheme = 'Light';
export const DEFAULTS = {
  displayName: `${Pkg.name}:PropList`,
  theme,
  fontSize: { sans: 12, mono: 11 },
  messageDelay: 1500,
} as const;
