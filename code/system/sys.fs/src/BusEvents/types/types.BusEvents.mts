import { t } from './common.mjs';

type FilePath = string; //      Path to a file, eg: "foo/bar.txt"
type FilesystemId = string; //  Unique identifier of the file-system store.
type Milliseconds = number;

/**
 * Event API
 */
export type FsBusEvents = t.Disposable & {
  id: FilesystemId;
  $: t.Observable<t.SysFsEvent>;
  changed$: t.Observable<t.SysFsChanged>;
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
    req$: t.Observable<t.SysFsManifestReq>;
    res$: t.Observable<t.SysFsManifestRes>;
    get(options?: {
      dir?: FilePath | FilePath[];
      cache?: boolean | 'force' | 'remove';
      cachefile?: string;
      timeout?: Milliseconds;
    }): Promise<t.SysFsManifestRes>;
  };
};

/**
 * Event API: IO (read/write)
 */
export type FsBusEventsIo = {
  info: {
    req$: t.Observable<t.SysFsInfoReq>;
    res$: t.Observable<t.SysFsInfoRes>;
    get(options?: {
      path?: FilePath | FilePath[];
      timeout?: Milliseconds;
    }): Promise<t.SysFsInfoRes>;
  };
  read: {
    req$: t.Observable<t.SysFsReadReq>;
    res$: t.Observable<t.SysFsReadRes>;
    get(
      path: FilePath | FilePath[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.FsBusReadResponse>;
  };
  write: {
    req$: t.Observable<t.SysFsWriteReq>;
    res$: t.Observable<t.SysFsWriteRes>;
    fire(
      file: t.FsBusFile | t.FsBusFile[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.FsBusWriteResponse>;
  };
  copy: {
    req$: t.Observable<t.SysFsCopyReq>;
    res$: t.Observable<t.SysFsCopyRes>;
    fire(
      file: t.FsBusFileTarget | t.FsBusFileTarget[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.FsBusCopyResponse>;
  };
  move: {
    req$: t.Observable<t.SysFsMoveReq>;
    res$: t.Observable<t.SysFsMoveRes>;
    fire(
      file: t.FsBusFileTarget | t.FsBusFileTarget[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.FsBusMoveResponse>;
  };
  delete: {
    req$: t.Observable<t.SysFsDeleteReq>;
    res$: t.Observable<t.SysFsDeleteRes>;
    fire(
      path: FilePath | FilePath[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.FsBusDeleteResponse>;
  };
};
