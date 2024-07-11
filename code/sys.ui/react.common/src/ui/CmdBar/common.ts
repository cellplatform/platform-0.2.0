import { Pkg, type t } from './common';

export { Keyboard } from 'sys.ui.dom';
export * from '../common';

export { useFocus } from '../../ui.use';
export { KeyHint } from '../KeyHint';
export { TextInput } from '../Text.Input';
export { TextboxSync } from '../Textbox.Sync';

/**
 * Constants
 */
const name = 'CmdBar';
const paths: t.CmdBarPaths = {
  text: ['text'],
  cmd: ['cmd'],
  history: ['history'],
};

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  commandPlaceholder: 'command',
  enabled: true,
  useKeyboard: true,
  focusOnReady: true,
  focusBorder: true,
  paths,
} as const;
