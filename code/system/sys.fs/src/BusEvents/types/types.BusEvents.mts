import { type t } from './common';

type FilePath = string; //      Path to a file, eg: "foo/bar.txt"
type FilesystemId = string; //  Unique identifier of the file-system store.
type Milliseconds = number;

/**
 * Event API
 */
export type FsBusEvents = t.Disposable & {
  id: FilesystemId;
  $: t.Observable<t.FsBusEvent>;
  changed$: t.Observable<t.FsBusChanged>;
  is: { base(input: any): boolean };
  io: t.FsBusEventsIo;
  index: t.FsBusEventsIndex;
  ready: FsReady;
  fs(options?: { dir?: string; timeout?: Milliseconds }): t.Fs;
  fs(subdir?: string): t.Fs;
};

/**
 * Response to the ready method.
 */
export type FsReady = (options?: FsReadyArgs) => Promise<FsReadyResponse>;
export type FsReadyArgs = { timeout?: Milliseconds; retries?: number };
export type FsReadyResponse = { ready: boolean; error?: t.FsError };

/**
 * Event API: indexing
 */
export type FsBusEventsIndex = {
  manifest: {
    req$: t.Observable<t.FsBusManifestReq>;
    res$: t.Observable<t.FsBusManifestRes>;
    get(options?: {
      dir?: FilePath | FilePath[];
      cache?: boolean | 'force' | 'remove';
      cachefile?: string;
      timeout?: Milliseconds;
    }): Promise<t.FsBusManifestRes>;
  };
};

/**
 * Event API: IO (read/write)
 */
export type FsBusEventsIo = {
  info: {
    req$: t.Observable<t.FsBusInfoReq>;
    res$: t.Observable<t.FsBusInfoRes>;
    get(options?: {
      path?: FilePath | FilePath[];
      timeout?: Milliseconds;
    }): Promise<t.FsBusInfoRes>;
  };
  read: {
    req$: t.Observable<t.FsBusReadReq>;
    res$: t.Observable<t.FsBusReadRes>;
    get(
      path: FilePath | FilePath[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.FsBusReadResponse>;
  };
  write: {
    req$: t.Observable<t.FsBusWriteReq>;
    res$: t.Observable<t.FsBusWriteRes>;
    fire(
      file: t.FsBusFile | t.FsBusFile[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.FsBusWriteResponse>;
  };
  copy: {
    req$: t.Observable<t.FsBusCopyReq>;
    res$: t.Observable<t.FsBusCopyRes>;
    fire(
      file: t.FsBusFileTarget | t.FsBusFileTarget[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.FsBusCopyResponse>;
  };
  move: {
    req$: t.Observable<t.FsBusMoveReq>;
    res$: t.Observable<t.FsBusMoveRes>;
    fire(
      file: t.FsBusFileTarget | t.FsBusFileTarget[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.FsBusMoveResponse>;
  };
  delete: {
    req$: t.Observable<t.FsBusDeleteReq>;
    res$: t.Observable<t.FsBusDeleteRes>;
    fire(
      path: FilePath | FilePath[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.FsBusDeleteResponse>;
  };
};
