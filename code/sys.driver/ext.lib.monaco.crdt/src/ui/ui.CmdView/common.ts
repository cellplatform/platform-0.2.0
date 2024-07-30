import { Pkg, R, type t } from '../common';

type P = t.CmdViewProps;
type E = t.CmdViewEditorProps;

/**
 * Exports
 */
export { Info as CrdtInfo } from 'ext.lib.automerge';
export * from '../common';

/**
 * Constants
 */
const name = 'CmdView';

const editor: t.PickRequired<E, 'readOnly' | 'lensPath' | 'editorPath'> = {
  readOnly: false,
  lensPath: [],
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
