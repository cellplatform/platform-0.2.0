import type { t } from './common';

export type EditorIdentityString = string;
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
export type EditorIdentities = { [id: string]: EditorIdentityState };
export type EditorIdentityState = {
  selections?: t.Selection[];
};

export type EditorIdentityStateChange = {
  readonly identity: t.IdString;
  readonly before: EditorIdentityState;
  readonly after: EditorIdentityState;
};
