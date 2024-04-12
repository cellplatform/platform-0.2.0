import { DEFAULTS as BASE, DevBase } from '../common';

export { CmdBar } from '../../ui/Cmd.Bar';
export * from '../common';
export * from './common.Filter';

export const ModuleList = DevBase.ModuleList;

/**
 * Constants
 */
export const DEFAULTS = {
  badge: ModuleList.DEFAULTS.badge,
  commandPlaceholder: 'command',
  focusOnReady: true,
  focusOnClick: false,
  autoGrabFocus: true,
  applyFilter: true,
  qs: BASE.qs,
} as const;
