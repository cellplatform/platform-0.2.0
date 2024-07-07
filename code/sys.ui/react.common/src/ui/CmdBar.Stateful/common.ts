import { Pkg, type t } from '../common';

export { useFocus } from '../../ui.use';
export { Ctrl } from '../CmdBar/ctrl';
export { TextboxSync } from '../Textbox.Sync';
export * from '../common';

import { DEFAULTS as BASE } from '../CmdBar/common';

/**
 * Constants
 */
const paths: t.CmdBarStatefulPaths = {
  text: ['text'],
};

const name = 'CmdBar.Stateful';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  paths,
  useKeyboard: BASE.useKeyboard,
} as const;
