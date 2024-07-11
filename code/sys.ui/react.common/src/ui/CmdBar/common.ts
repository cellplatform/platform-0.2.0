import { Color, Pkg, type t } from './common';

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

const focusBorder: t.CmdBarFocusBorder = {
  offset: -2,
  color: {
    focused: Color.BLUE,
    unfocused: (theme) => theme.alpha(theme.is.light ? 0.4 : 1).fg,
  },
};

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  commandPlaceholder: 'command',
  enabled: true,
  useKeyboard: true,
  focusOnReady: true,
  focusBorder,
  paths,
} as const;
