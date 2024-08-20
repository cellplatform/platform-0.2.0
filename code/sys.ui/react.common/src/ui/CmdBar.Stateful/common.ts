import { DEFAULTS as BASE } from '../CmdBar/common';
import { Pkg } from '../common';

export { Ctrl, Path } from '../CmdBar.Ctrl';
export { ObjectView } from '../ObjectView';

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
  useKeyboard: BASE.props.useKeyboard,
  focusOnReady: BASE.props.focusOnReady,
  focusBorder: BASE.focusBorder,
} as const;
