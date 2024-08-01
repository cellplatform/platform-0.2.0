import type { t } from './common';

export type EditorUpdateStrategy = 'Splice' | 'Overwrite';

export type EditorPaths = {
  text: t.ObjectPath;
  identity: t.ObjectPath;
  cmd: t.ObjectPath;
};

export type EditorIdentityState = {
  selection?: t.Selection;
};
