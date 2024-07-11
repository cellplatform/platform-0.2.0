import { DEFAULTS as BASE } from '../CmdBar/common';
import { Pkg } from '../common';

export { Ctrl } from '../CmdBar.Ctrl';
export * from '../common';

/**
 * Constants
 */
const name = 'CmdBar.Stateful';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  paths: BASE.paths,
  useHistory: true,
  useKeyboard: BASE.useKeyboard,
  focusBorder: BASE.focusBorder,
  focusOnReady: BASE.focusOnReady,
} as const;
