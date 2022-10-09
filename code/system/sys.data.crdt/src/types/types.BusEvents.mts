import { t } from './common.mjs';

type O = Record<string, unknown>;
type Id = string;
type DocumentId = string;
type Milliseconds = number;

/**
 * Event API.
 */
export type CrdtEvents = t.Disposable & {
  $: t.Observable<t.CrdtEvent>;
  instance: { bus: Id; id: Id };
  is: { base(input: any): boolean };

  info: {
    req$: t.Observable<t.CrdtInfoReq>;
    res$: t.Observable<t.CrdtInfoRes>;
    get(options?: { timeout?: Milliseconds }): Promise<t.CrdtInfoRes>;
  };

  ref: {
    req$: t.Observable<t.CrdtRefReq>;
    res$: t.Observable<t.CrdtRefRes>;
    created$: t.Observable<t.CrdtRefCreated>;
    changed$: t.Observable<t.CrdtRefChanged>;
    fire<T extends O>(args: CrdtEventsRefArgs<T>): Promise<t.CrdtRefRes<T>>;
    exists: {
      req$: t.Observable<t.CrdtRefExistsReq>;
      res$: t.Observable<t.CrdtRefExistsRes>;
      fire(id: DocumentId, options?: { timeout?: Milliseconds }): Promise<t.CrdtRefExistsRes>;
    };
    remove: {
      remove$: t.Observable<t.CrdtRefRemove>;
      removed$: t.Observable<t.CrdtRefRemoved>;
      fire(id: DocumentId): Promise<void>;
    };
  };

  doc<T extends O>(args: t.CrdtDocEventsArgs<T>): Promise<t.CrdtDocEvents<T>>;
};

export type CrdtEventsRefArgs<T extends O> = {
  id: DocumentId;
  load?: t.CrdtStorageLoadCtx;
  change?: t.CrdtChangeHandler<T> | T;
  save?: t.CrdtStorageSaveCtx;
  timeout?: Milliseconds;
};
