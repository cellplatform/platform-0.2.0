import { type t } from './common.mjs';

type O = Record<string, unknown>;
type SemVer = string;

/**
 * Informatino about the running CRDT controller module.
 */
export type CrdtInfo = {
  module: { name: string; version: SemVer };
  dataformat: { name: string; version: SemVer };
};

/**
 * Handler to make an immutable change to the CRDT document.
 */
export type CrdtChangeHandler<T extends O> = (doc: T) => void;

/**
 * Handler that persists the CRDT to a filesystem store.
 */
export type CrdtStorageStrategy = 'Doc' | 'Log';
export type CrdtStorageCtx = {
  fs: t.Fs;
  path: string;
  strategy?: CrdtStorageStrategy;
};
export type CrdtStorageLoadCtx = CrdtStorageCtx;
export type CrdtStorageSaveCtx = CrdtStorageCtx & {
  json?: boolean; // Flag indicating if a JSON snapshot should also be written to storage.
};
