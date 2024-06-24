import { DEFAULTS as BASE, DevBase, Pkg, type t } from '../common';
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
  displayName: `${Pkg.name}.CmdHost`,
  pkg,
  filter,
  commandPlaceholder: 'command',
  focusOnReady: true,
  focusOnClick: false,
  autoGrabFocus: true,
  commandbarVisible: true,
  qs: BASE.qs,
} as const;
