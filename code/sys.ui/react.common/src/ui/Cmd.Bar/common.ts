import { Pkg } from './common';

export { TextInput } from '../Text.Input';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}.Cmd.Bar`,
  enabled: true,
  focusOnReady: true,
  commandPlaceholder: 'command',
} as const;
