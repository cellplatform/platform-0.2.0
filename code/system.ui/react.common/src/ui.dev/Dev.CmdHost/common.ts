import { type t, DEFAULTS as BASE, DevBase } from '../common';

export { CmdBar } from '../../ui/Cmd.Bar';
export * from '../common';
export * from './common.Filter';

export const ModuleList = DevBase.ModuleList;

/**
 * Constants
 */
const pkg: t.CmdHostProps['pkg'] = { name: 'unknown', version: '0.0.0' };

export const DEFAULTS = {
  pkg,
  badge: ModuleList.DEFAULTS.badge,
  commandPlaceholder: 'command',
  focusOnReady: true,
  focusOnClick: false,
  autoGrabFocus: true,
  applyFilter: true,
  qs: BASE.qs,
} as const;
