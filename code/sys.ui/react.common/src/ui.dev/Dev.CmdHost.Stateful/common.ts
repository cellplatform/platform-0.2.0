import { DEFAULTS as BASE, Pkg, type t } from '../common';
import { Filter } from '../Dev.CmdHost/u.Filter';

export * from '../common';
export { Filter };

/**
 * Constants
 */
const filter: t.CmdHostFilter = (imports, command) => {
  return Filter.imports(imports, command, { maxErrors: 1 });
};

export const DEFAULTS = {
  displayName: `${Pkg.name}:CmdHost.Stateful`,
  filter,
  qs: BASE.qs,
} as const;
