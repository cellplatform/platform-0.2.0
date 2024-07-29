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

const editor: t.PickRequired<t.CmdViewEditorProps, 'readOnly'> = {
  readOnly: false,
};
const props: t.PickRequired<t.CmdViewProps, 'theme' | 'enabled' | 'editor' | 'historyStack'> = {
  theme: 'Dark',
  enabled: true,
  historyStack: true,
  editor,
};

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
} as const;
