import type { t } from '../common.t';

/**
 * Extends a CRDT [DocRef] with file-system persistence.
 */
export type CrdtDocFile<D extends {}> = t.Disposable & {
  readonly doc: t.CrdtDocRef<D>;
  readonly isDisposed: boolean;
  readonly isAutosaving: boolean;
  readonly isLogging: boolean;
  exists(): Promise<boolean>;
  info(): Promise<CrdtDocFileInfo>;
  load(): Promise<void>;
  save(): Promise<void>;
};

export type CrdtDocFileInfo = {
  bytes: number;
  exists: boolean;
  manifest: t.DirManifest;
};
