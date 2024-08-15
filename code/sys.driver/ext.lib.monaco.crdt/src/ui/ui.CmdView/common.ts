import { Pkg, type t } from '../common';

type P = t.CmdViewProps;
type E = t.CmdViewPropsEditor;

/**
 * Exports
 */
export { Info as CrdtInfo } from 'ext.lib.automerge';
export * from '../common';
export { Syncer } from '../u.Syncer';

/**
 * Constants
 */
const name = 'CmdView';

const editor: t.PickRequired<E, 'readOnly' | 'dataPath' | 'editorPath'> = {
  readOnly: false,
  dataPath: [],
  editorPath: ['editor'],
};
const props: t.PickRequired<P, 'theme' | 'enabled' | 'historyStack'> & {
  editor: typeof editor;
} = {
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
