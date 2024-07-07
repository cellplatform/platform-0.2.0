import { Text } from 'sys.util';
import { Pkg } from '../common';

export * from '../common';
export { TextInput } from '../Text.Input';

/**
 * Constants
 */
const name = 'Textbox.Sync';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  splice: Text.splice,
  diff: Text.diff,
} as const;
