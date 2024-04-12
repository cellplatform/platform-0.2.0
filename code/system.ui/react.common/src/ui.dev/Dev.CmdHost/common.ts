import { DEFAULTS as BASE, DevBase } from '../common';

export { CmdBar } from '../../ui/Cmd.Bar';
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
  focusOnClick: false,
  autoGrabFocus: true,
  applyFilter: true,
  qs: BASE.qs,
} as const;
