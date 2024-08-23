import { Color, Pkg, type t } from './common';

export { Keyboard } from 'sys.ui.dom';
export * from '../common';

export { useFocus } from '../../ui.use';
export { KeyHint } from '../KeyHint';
export { TextInput } from '../Text.Input';
export { TextboxSync } from '../Textbox.Sync';
export { Spinner } from '../Spinner';

/**
 * Constants
 */
const paths: t.CmdBarPaths = {
  cmd: ['cmd'],
  text: ['text'],
  meta: ['meta'],
};

const focusBorder: t.CmdBarFocusBorder = {
  offset: -2,
  color: {
    focused: Color.BLUE,
    unfocused: (theme) => theme.alpha(theme.is.light ? 0.4 : 1).fg,
  },
};

const props: t.PickRequired<
  t.CmdBarProps,
  'theme' | 'enabled' | 'spinning' | 'useKeyboard' | 'focusOnReady' | 'placeholder'
> = {
  theme: 'Dark',
  placeholder: 'command',
  enabled: true,
  spinning: false,
  useKeyboard: true,
  focusOnReady: true,
};

const name = 'CmdBar';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
  paths,
  focusBorder,
} as const;
