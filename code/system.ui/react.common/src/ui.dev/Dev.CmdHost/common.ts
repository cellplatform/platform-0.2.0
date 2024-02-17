import { DEFAULTS as BASE, DevBase } from '../common';

export { CommandBar } from '../../ui/Command.Bar';
export * from '../common';
export * from './common.Filter';
export const SpecList = DevBase.SpecList;

/**
 * Constants
 */
export const DEFAULTS = {
  badge: SpecList.DEFAULTS.badge,
  commandPlaceholder: 'command',
  focusOnReady: true,
  qs: BASE.qs,
} as const;
