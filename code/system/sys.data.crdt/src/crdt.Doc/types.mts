import type { t } from '../common.t';

/**
 * A file-system wrapper for a single CRDT document.
 */
export type CrdtDocFile<D extends {}> = t.Disposable & {
  readonly doc: t.CrdtDocRef<D>;
  readonly isAutosaving: boolean;
  readonly isLogging: boolean;
  readonly isDisposed: boolean;
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
