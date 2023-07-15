import type { t } from './common';

/**
 * Extends a CRDT [DocRef] with file-system persistence.
 */
export type CrdtDocFile<D extends {}> = t.Disposable & {
  readonly kind: 'Crdt:DocFile';
  readonly $: t.Observable<CrdtFileAction>;
  readonly doc: t.CrdtDocRef<D>;
  readonly disposed: boolean;
  autosaving: boolean;
  logging: boolean;
  exists(): Promise<boolean>;
  info(): Promise<CrdtFileInfo>;
  load(): Promise<void>;
  save(): Promise<void>;
  delete(): Promise<void>;
};

export type CrdtFileInfo = {
  readonly bytes: number;
  readonly exists: boolean;
  readonly manifest: t.DirManifest;
};

export type CrdtFileActionKind = CrdtFileAction['action'];
export type CrdtFileAction = CrdtFileActionSaved | CrdtFileActionDeleted;

export type CrdtFileActionSaved = {
  action: 'saved';
  kind: 'file' | 'log';
  filename: string;
  bytes: number;
  hash: string;
};

export type CrdtFileActionDeleted = {
  action: 'deleted';
  file: number;
  logfiles: number;
};
