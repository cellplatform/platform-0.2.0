import { DEFAULTS as BASE } from '../CmdBar/common';
import { Pkg } from '../common';

export { Ctrl } from '../CmdBar/Ctrl';
export { Path } from '../CmdBar/u';
export { TextboxSync } from '../Textbox.Sync';

export { useFocus } from '../../ui.use';
export * from '../common';

/**
 * Constants
 */
const name = 'CmdBar.Stateful';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  paths: BASE.paths,
  useKeyboard: BASE.useKeyboard,
} as const;
