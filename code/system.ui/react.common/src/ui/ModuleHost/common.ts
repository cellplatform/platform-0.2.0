import { ModuleList } from 'sys.ui.react.dev';
import { DEFAULTS as BASE } from '../../ui.dev/common';

export { Keyboard } from '../Text.Keyboard';
export { TextInput } from '../Text.Input';
export * from '../common';
export * from './common.Filter';
export { ModuleList };

/**
 * Constants
 */
export const DEFAULTS = {
  badge: ModuleList.DEFAULTS.badge,
  commandPlaceholder: 'command',
  focusOnReady: true,
  qs: BASE.qs,
} as const;
