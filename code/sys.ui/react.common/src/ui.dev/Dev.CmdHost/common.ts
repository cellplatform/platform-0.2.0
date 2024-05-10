import { DEFAULTS as BASE, DevBase, type t } from '../common';
import { Filter } from './common.Filter';

export { CmdBar } from '../../ui/Cmd.Bar';
export * from '../common';
export * from './common.Filter';

export const ModuleList = DevBase.ModuleList;

/**
 * Constants
 */
const pkg: t.CmdHostProps['pkg'] = { name: 'unknown', version: '0.0.0' };
const filter: t.CmdHostFilter = (imports, command) => Filter.imports(imports, command);

export const DEFAULTS = {
  displayName: 'CmdHost',
  pkg,
  filter,
  commandPlaceholder: 'command',
  focusOnReady: true,
  focusOnClick: false,
  autoGrabFocus: true,
  qs: BASE.qs,
} as const;
