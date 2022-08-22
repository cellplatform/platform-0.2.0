import { t } from './common.mjs';

type CellUri = string; //     URI "cell:<ns>:A1"
type CellDomain = string; //  Host "<domain>"
type CellAddress = string; // Combination "<domain>/<cell:uri>"

type Milliseconds = number;
type FilesystemId = string;
type FilePath = string;

/**
 * Event API
 */
export type SysFsEvents = t.Disposable & {
  id: FilesystemId;
  $: t.Observable<t.SysFsEvent>;
  changed$: t.Observable<t.SysFsChanged>;
  is: { base(input: any): boolean };
  io: t.SysFsEventsIo;
  index: t.SysFsEventsIndex;
  remote: t.SysFsEventsRemote;
  ready: SysFsReady;
  fs(options?: FsOptions): t.Fs;
  fs(subdir?: string): t.Fs;
};

type FsOptions = { dir?: string; timeout?: Milliseconds };

/**
 * Response to the ready method.
 */
export type SysFsReady = (options?: SysFsReadyArgs) => Promise<SysFsReadyRes>;
export type SysFsReadyArgs = { timeout?: Milliseconds; retries?: number };
export type SysFsReadyRes = { ready: boolean; error?: t.SysFsError };

/**
 * Event API: indexing
 */
export type SysFsEventsIndex = {
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
export type SysFsEventsIo = {
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
    ): Promise<t.SysFsReadResponse>;
  };
  write: {
    req$: t.Observable<t.SysFsWriteReq>;
    res$: t.Observable<t.SysFsWriteRes>;
    fire(
      file: t.SysFsFile | t.SysFsFile[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.SysFsWriteResponse>;
  };
  copy: {
    req$: t.Observable<t.SysFsCopyReq>;
    res$: t.Observable<t.SysFsCopyRes>;
    fire(
      file: t.SysFsFileTarget | t.SysFsFileTarget[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.SysFsCopyResponse>;
  };
  move: {
    req$: t.Observable<t.SysFsMoveReq>;
    res$: t.Observable<t.SysFsMoveRes>;
    fire(
      file: t.SysFsFileTarget | t.SysFsFileTarget[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.SysFsMoveResponse>;
  };
  delete: {
    req$: t.Observable<t.SysFsDeleteReq>;
    res$: t.Observable<t.SysFsDeleteRes>;
    fire(
      path: FilePath | FilePath[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.SysFsDeleteResponse>;
  };
};

/**
 * Event API: remote cell
 */
export type SysFsEventsRemote = {
  push: {
    req$: t.Observable<t.SysFsCellPushReq>;
    res$: t.Observable<t.SysFsCellPushRes>;
    fire(
      uri: CellAddress,
      path?: FilePath | FilePath[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.SysFsCellPushRes>;
  };
  pull: {
    req$: t.Observable<t.SysFsCellPullReq>;
    res$: t.Observable<t.SysFsCellPullRes>;
    fire(
      uri: CellAddress,
      path?: FilePath | FilePath[],
      options?: { timeout?: Milliseconds },
    ): Promise<t.SysFsCellPullRes>;
  };
  cell(domain: CellDomain, uri: CellUri): SysFsEventsCell;
  cell(address: CellAddress): SysFsEventsCell;
};

export type SysFsEventsCell = {
  domain: CellDomain;
  uri: CellUri;
  push(
    path?: FilePath | FilePath[],
    options?: { timeout?: Milliseconds },
  ): Promise<t.SysFsCellPushRes>;
  pull(
    path?: FilePath | FilePath[],
    options?: { timeout?: Milliseconds },
  ): Promise<t.SysFsCellPullRes>;
};
