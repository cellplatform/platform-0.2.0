import type { t } from '../common.t';

/**
 * Extends a CRDT [DocRef] with file-system persistence.
 */
export type CrdtDocFile<D extends {}> = t.Disposable & {
  readonly kind: 'Crdt:DocFile';
  readonly doc: t.CrdtDocRef<D>;
  readonly disposed: boolean;
  readonly isAutosaving: boolean;
  readonly isLogging: boolean;
  exists(): Promise<boolean>;
  info(): Promise<CrdtDocFileInfo>;
  load(): Promise<void>;
  save(): Promise<void>;
};

export type CrdtDocFileInfo = {
  readonly bytes: number;
  readonly exists: boolean;
  readonly manifest: t.DirManifest;
};
