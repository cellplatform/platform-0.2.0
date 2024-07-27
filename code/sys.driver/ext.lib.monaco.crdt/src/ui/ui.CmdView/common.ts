import { Pkg, type t } from '../common';

/**
 * Exports
 */
export { Info as CrdtInfo } from 'ext.lib.automerge';
export * from '../common';

/**
 * Constants
 */
const name = 'CmdView';
const props: t.PickRequired<t.CmdViewProps, 'theme' | 'readOnly' | 'historyStack' | 'infoFields'> =
  {
    theme: 'Dark',
    readOnly: false,
    historyStack: true,
    infoFields: ['Repo', 'Doc', 'Doc.URI', 'Doc.Object'],
  };

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
} as const;
