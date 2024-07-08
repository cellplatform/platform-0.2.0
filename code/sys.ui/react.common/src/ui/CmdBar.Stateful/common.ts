import { Pkg } from '../common';

export { useFocus } from '../../ui.use';
export { Ctrl } from '../CmdBar/ctrl';
export * from '../common';
export { TextboxSync } from '../Textbox.Sync';

import { DEFAULTS as BASE } from '../CmdBar/common';

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
