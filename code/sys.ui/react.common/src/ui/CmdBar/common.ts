import { Pkg } from './common';

export { KeyHint } from '../KeyHint';
export { TextInput } from '../Text.Input';
export * from '../common';

/**
 * Constants
 */
const name = 'CmdBar';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}.${name}`,
  enabled: true,
  focusOnReady: true,
  commandPlaceholder: 'command',
} as const;
