import { filter } from 'rxjs/operators';

import { rx, slug, t, Wrangle } from './common';

type FilesystemId = string;

/**
 * Primitive IO events (read,write,copy,delete).
 */
export function BusEventsIo(args: {
  id: FilesystemId;
  $: t.Observable<t.FsBusEvent>;
  bus: t.EventBus<t.FsBusEvent>;
  timeout: number;
}): t.FsBusEventsIo {
  const { id, $, bus } = args;
  const toTimeout = Wrangle.timeout(args.timeout);

  const toError = (
    error?: { message: string; code: string; path?: string },
    defaultCode?: t.FsErrorCode,
  ): t.FsError => {
    const message = error?.message ?? 'Failed';
    const path = error?.path ?? '';
    const code: t.FsErrorCode =
      error?.code === 'timeout' ? 'fs:client/timeout' : defaultCode ?? 'fs:unknown';
    return { code, message, path };
  };

  /**
   * File/system information.
   */
  const info: t.FsBusEventsIo['info'] = {
    req$: rx.payload<t.FsBusInfoReqEvent>($, 'sys.fs/info:req'),
    res$: rx.payload<t.FsBusInfoResEvent>($, 'sys.fs/info:res'),
    async get(options = {}) {
      const { path } = options;
      const tx = slug();
      const res$ = info.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.FsBusInfoResEvent>(res$, { timeout: toTimeout(options) });

      bus.fire({
        type: 'sys.fs/info:req',
        payload: { tx, id, path },
      });

      const res = await first;
      if (res.payload) {
        return res.payload;
      }

      const error = toError(res.error, 'fs:info');
      const fail: t.FsBusInfoRes = { tx, id, paths: [], error };
      return fail;
    },
  };

  /**
   * Read
   */
  const read: t.FsBusEventsIo['read'] = {
    req$: rx.payload<t.FsBusReadReqEvent>($, 'sys.fs/read:req'),
    res$: rx.payload<t.FsBusReadResEvent>($, 'sys.fs/read:res'),
    async get(path, options = {}) {
      const tx = slug();
      const op = 'read';
      const res$ = read.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.FsBusReadResEvent>(res$, {
        op,
        timeout: toTimeout(options),
      });

      bus.fire({
        type: 'sys.fs/read:req',
        payload: { tx, id, path },
      });

      const res = await first;
      if (res.payload) {
        const { files, error } = res.payload;
        return { files, error };
      }

      const error = toError(res.error, 'fs:read');
      const fail: t.FsBusReadResponse = { files: [], error };
      return fail;
    },
  };

  /**
   * Write
   */
  const write: t.FsBusEventsIo['write'] = {
    req$: rx.payload<t.FsBusWriteReqEvent>($, 'sys.fs/write:req'),
    res$: rx.payload<t.FsBusWriteResEvent>($, 'sys.fs/write:res'),
    async fire(file, options = {}) {
      const tx = slug();
      const op = 'write';
      const res$ = write.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.FsBusWriteResEvent>(res$, {
        op,
        timeout: toTimeout(options),
      });

      bus.fire({
        type: 'sys.fs/write:req',
        payload: { tx, id, file },
      });

      const res = await first;
      if (res.payload) {
        const { files, error } = res.payload;
        return { files, error };
      }

      const error = toError(res.error, 'fs:write');
      const fail: t.FsBusWriteResponse = { files: [], error };
      return fail;
    },
  };

  /**
   * Copy
   */
  const copy: t.FsBusEventsIo['copy'] = {
    req$: rx.payload<t.FsBusCopyReqEvent>($, 'sys.fs/copy:req'),
    res$: rx.payload<t.FsBusCopyResEvent>($, 'sys.fs/copy:res'),
    async fire(file, options = {}) {
      const tx = slug();
      const op = 'copy';
      const res$ = copy.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.FsBusCopyResEvent>(res$, {
        op,
        timeout: toTimeout(options),
      });

      bus.fire({
        type: 'sys.fs/copy:req',
        payload: { tx, id, file },
      });

      const res = await first;
      if (res.payload) {
        const { files, error } = res.payload;
        return { files, error };
      }

      const error = toError(res.error, 'fs:copy');
      const fail: t.FsBusCopyResponse = { files: [], error };
      return fail;
    },
  };

  /**
   * Move
   */
  const move: t.FsBusEventsIo['move'] = {
    req$: rx.payload<t.FsBusMoveReqEvent>($, 'sys.fs/move:req'),
    res$: rx.payload<t.FsBusMoveResEvent>($, 'sys.fs/move:res'),
    async fire(file, options = {}) {
      const tx = slug();
      const op = 'move';
      const res$ = move.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.FsBusMoveResEvent>(res$, {
        op,
        timeout: toTimeout(options),
      });

      bus.fire({
        type: 'sys.fs/move:req',
        payload: { tx, id, file },
      });

      const res = await first;
      if (res.payload) {
        const { files, error } = res.payload;
        return { files, error };
      }

      const error = toError(res.error, 'fs:move');
      const fail: t.FsBusMoveResponse = { files: [], error };
      return fail;
    },
  };

  /**
   * Delete
   */
  const del: t.FsBusEventsIo['delete'] = {
    req$: rx.payload<t.FsBusDeleteReqEvent>($, 'sys.fs/delete:req'),
    res$: rx.payload<t.FsBusDeleteResEvent>($, 'sys.fs/delete:res'),
    async fire(path, options = {}) {
      const tx = slug();
      const op = 'delete';
      const res$ = del.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.FsBusDeleteResEvent>(res$, {
        op,
        timeout: toTimeout(options),
      });

      bus.fire({
        type: 'sys.fs/delete:req',
        payload: { tx, id, path },
      });

      const res = await first;
      if (res.payload) {
        const { files, error } = res.payload;
        return { files, error };
      }

      const error = toError(res.error, 'fs:delete');
      const fail: t.FsBusDeleteResponse = { files: [], error };
      return fail;
    },
  };

  /**
   * API
   */
  return { info, read, write, copy, move, delete: del };
}
