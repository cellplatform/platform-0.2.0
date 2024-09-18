import { type t } from './common.ts';
import { Client } from './u.Http.Client.ts';
import { HttpUrl as Url } from './u.Http.Url.ts';
import { Is } from './u.Is.ts';
import { toHeaders } from './u.ts';

type O = Record<string, unknown>;

/**
 * Http fetch helper.
 */
export const Http: t.HttpLib = {
  Is,
  Url,
  url: Url.create,
  client: Client.create,

  toError(res: Response) {
    const { ok, status, statusText } = res;
    const headers = toHeaders(res.headers);
    return { ok, status, statusText, headers };
  },

  async toResponse<T extends O>(res: Response) {
    const ok = res.ok;
    const error = ok ? undefined : Http.toError(res);
    const data = ok ? ((await res.json()) as T) : undefined;
    return { ok, data, error } as t.HttpClientResponse<T>;
  },
} as const;
