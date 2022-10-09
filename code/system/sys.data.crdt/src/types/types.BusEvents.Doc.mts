import { t } from './common.mjs';

type O = Record<string, unknown>;
type DocumentId = string;

/**
 * Initialization variants for a new document wrapper.
 */
export type CrdtDocEventsArgsInit<T> = { id: DocumentId; initial: T | (() => T) };
export type CrdtDocEventsArgsLoad = {
  id: DocumentId;
  load: { fs: t.Fs; path: string; strategy?: t.CrdtStorageStrategy };
};

/**
 * Event API: Single document.
 */
export type CrdtDocEvents<T extends O> = {
  id: DocumentId;
  current: T;
  changed$: t.Observable<t.CrdtRefChanged<O>>;
  change(handler: t.CrdtChangeHandler<T>): Promise<T>;
  save(
    fs: t.Fs,
    path: string,
    options?: { strategy?: t.CrdtStorageStrategy; json?: boolean },
  ): Promise<t.CrdtDocSaveResponse>;
};

export type CrdtDocSaveResponse = { path: string; error?: string };
