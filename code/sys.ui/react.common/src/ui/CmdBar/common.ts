import { Pkg } from './common';

export { Keyboard } from 'sys.ui.dom';
export * from '../common';

export { useFocus } from '../../ui.use';
export { KeyHint } from '../KeyHint';
export { TextInput } from '../Text.Input';

/**
 * Constants
 */
const name = 'CmdBar';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  commandPlaceholder: 'command',
  enabled: true,
  focusOnReady: true,
  useKeyboard: true,
} as const;
