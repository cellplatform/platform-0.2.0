import { DEFAULTS as BASE, DevBase, type t } from '../common';

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
  commandPlaceholder: 'command',
  focusOnReady: true,
  focusOnClick: false,
  autoGrabFocus: true,
  applyFilter: true,
  qs: BASE.qs,
} as const;
