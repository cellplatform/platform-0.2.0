import { firstValueFrom, of, timeout } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { rx, slug, t, Wrangle, asArray } from './common';

type FilesystemId = string;

/**
 * Events for indexing a filesystem.
 */
export function BusEventsIndexer(args: {
  id: FilesystemId;
  $: t.Observable<t.FsBusEvent>;
  bus: t.EventBus<t.FsBusEvent>;
  timeout: number;
}): t.FsBusEventsIndex {
  const { id, $, bus } = args;
  const toTimeout = Wrangle.timeout(args.timeout);

  const manifest: t.FsBusEventsIndex['manifest'] = {
    req$: rx.payload<t.FsBusManifestReqEvent>($, 'sys.fs/manifest:req'),
    res$: rx.payload<t.FsBusManifestResEvent>($, 'sys.fs/manifest:res'),

    async get(options = {}) {
      const { dir, cache, cachefile } = options;
      const msecs = toTimeout(options);
      const tx = slug();

      const first = firstValueFrom(
        manifest.res$.pipe(
          filter((e) => e.tx === tx),
          timeout(msecs),
          catchError(() => of(`[SysFs.Index.Manifest] request timed out after ${msecs} msecs`)),
        ),
      );

      bus.fire({
        type: 'sys.fs/manifest:req',
        payload: { tx, id, dir, cache, cachefile },
      });

      const res = await first;
      if (typeof res !== 'string') {
        return res;
      }

      const error: t.FsError = { code: 'fs:client/timeout', message: res, path: flattenPath(dir) };
      const fail: t.FsBusManifestRes = { tx, id, dirs: [], error };
      return fail;
    },
  };

  return { manifest };
}

/**
 * Helpers
 */

function flattenPath(input?: string | string[]) {
  return asArray(input).join('; ');
}
