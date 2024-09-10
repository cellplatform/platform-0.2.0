import { Pkg, type t } from '../common';

type P = t.CrdtEditorProps;
type E = t.CrdtEditorPropsEditor;

/**
 * Exports
 */
export { Info as CrdtInfo } from 'ext.lib.automerge';
export * from '../common';
export { Syncer } from '../u.Syncer';

/**
 * Constants
 */
const name = 'CrdtEditor';

const editor: t.PickRequired<E, 'readOnly' | 'dataPath' | 'editorPath'> = {
  readOnly: false,
  dataPath: [],
  editorPath: ['editor'],
};
const props: t.PickRequired<P, 'theme' | 'enabled' | 'historyStack' | 'editorOnly'> & {
  editor: typeof editor;
} = {
  theme: 'Dark',
  enabled: true,
  historyStack: true,
  editorOnly: false,
  editor,
};

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,

  Panel: {
    Info: {
      fields: {
        get all(): t.CrdtEditorInfoField[] {
          return ['Repo', 'Doc', 'Doc.URI', 'Doc.Object'];
        },
        get default(): t.CrdtEditorInfoField[] {
          return ['Repo', 'Doc', 'Doc.URI', 'Doc.Object'];
        },
      },
    },
  },
} as const;
