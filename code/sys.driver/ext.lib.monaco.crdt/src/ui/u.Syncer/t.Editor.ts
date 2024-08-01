import type { t } from './common';

export type EditorUpdateStrategy = 'Splice' | 'Overwrite';

/**
 * Definition of paths to the editor state object.
 */
export type EditorPaths = {
  text: t.ObjectPath;
  identity: t.ObjectPath;
  cmd: t.ObjectPath;
};

/**
 * The transient editor state of a single identity (aka. "user").
 */
export type EditorIdentityState = {
  selection?: t.Selection;
};
