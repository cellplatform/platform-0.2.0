import { filter } from 'rxjs/operators';

import { rx, slug, t, Wrangle } from './common.mjs';

type FilesystemId = string;

/**
 * Primitive IO events (read,write,copy,delete).
 */
export function BusEventsIo(args: {
  id: FilesystemId;
  $: t.Observable<t.SysFsEvent>;
  bus: t.EventBus<t.SysFsEvent>;
  timeout: number;
}): t.SysFsEventsIo {
  const { id, $, bus } = args;
  const toTimeout = Wrangle.timeout(args.timeout);

  const toError = (
    error?: { message: string; code: string },
    defaultCode?: t.SysFsErrorCode,
  ): t.SysFsError => {
    const message = error?.message ?? 'Failed';
    const code = error?.code === 'timeout' ? 'client/timeout' : defaultCode ?? 'unknown';
    return { code, message };
  };

  /**
   * File/system information.
   */
  const info: t.SysFsEventsIo['info'] = {
    req$: rx.payload<t.SysFsInfoReqEvent>($, 'sys.fs/info:req'),
    res$: rx.payload<t.SysFsInfoResEvent>($, 'sys.fs/info:res'),
    async get(options = {}) {
      const { path } = options;
      const tx = slug();
      const res$ = info.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.SysFsInfoResEvent>(res$, { timeout: toTimeout(options) });

      bus.fire({
        type: 'sys.fs/info:req',
        payload: { tx, id, path },
      });

      const res = await first;
      if (res.payload) {
        return res.payload;
      }

      const error = toError(res.error, 'info');
      const fail: t.SysFsInfoRes = { tx, id, paths: [], error };
      return fail;
    },
  };

  /**
   * Read
   */
  const read: t.SysFsEventsIo['read'] = {
    req$: rx.payload<t.SysFsReadReqEvent>($, 'sys.fs/read:req'),
    res$: rx.payload<t.SysFsReadResEvent>($, 'sys.fs/read:res'),
    async get(path, options = {}) {
      const tx = slug();
      const op = 'read';
      const res$ = read.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.SysFsReadResEvent>(res$, {
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

      const error = toError(res.error, 'read');
      const fail: t.SysFsReadResponse = { files: [], error };
      return fail;
    },
  };

  /**
   * Write
   */
  const write: t.SysFsEventsIo['write'] = {
    req$: rx.payload<t.SysFsWriteReqEvent>($, 'sys.fs/write:req'),
    res$: rx.payload<t.SysFsWriteResEvent>($, 'sys.fs/write:res'),
    async fire(file, options = {}) {
      const tx = slug();
      const op = 'write';
      const res$ = write.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.SysFsWriteResEvent>(res$, {
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

      const error = toError(res.error, 'write');
      const fail: t.SysFsWriteResponse = { files: [], error };
      return fail;
    },
  };

  /**
   * Copy
   */
  const copy: t.SysFsEventsIo['copy'] = {
    req$: rx.payload<t.SysFsCopyReqEvent>($, 'sys.fs/copy:req'),
    res$: rx.payload<t.SysFsCopyResEvent>($, 'sys.fs/copy:res'),
    async fire(file, options = {}) {
      const tx = slug();
      const op = 'copy';
      const res$ = copy.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.SysFsCopyResEvent>(res$, {
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

      const error = toError(res.error, 'copy');
      const fail: t.SysFsCopyResponse = { files: [], error };
      return fail;
    },
  };

  /**
   * Move
   */
  const move: t.SysFsEventsIo['move'] = {
    req$: rx.payload<t.SysFsMoveReqEvent>($, 'sys.fs/move:req'),
    res$: rx.payload<t.SysFsMoveResEvent>($, 'sys.fs/move:res'),
    async fire(file, options = {}) {
      const tx = slug();
      const op = 'move';
      const res$ = move.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.SysFsMoveResEvent>(res$, {
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

      const error = toError(res.error, 'move');
      const fail: t.SysFsMoveResponse = { files: [], error };
      return fail;
    },
  };

  /**
   * Delete
   */
  const del: t.SysFsEventsIo['delete'] = {
    req$: rx.payload<t.SysFsDeleteReqEvent>($, 'sys.fs/delete:req'),
    res$: rx.payload<t.SysFsDeleteResEvent>($, 'sys.fs/delete:res'),
    async fire(path, options = {}) {
      const tx = slug();
      const op = 'delete';
      const res$ = del.res$.pipe(filter((e) => e.tx === tx));
      const first = rx.asPromise.first<t.SysFsDeleteResEvent>(res$, {
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

      const error = toError(res.error, 'delete');
      const fail: t.SysFsDeleteResponse = { files: [], error };
      return fail;
    },
  };

  /**
   * API
   */
  return { info, read, write, copy, move, delete: del };
}
