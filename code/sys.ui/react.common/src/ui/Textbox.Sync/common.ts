import { Pkg } from '../common';
export * from '../common';

export { Text } from 'sys.util';
export { TextInput } from '../Text.Input';

/**
 * Constants
 */
const name = 'Textbox.Sync';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
} as const;
