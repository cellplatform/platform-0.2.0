import { type t } from './common';

type O = Record<string, unknown>;

export function methods(fetcher: t.HttpFetcher): t.HttpFetchMethods {
  return {
    get: (path: string) => fetcher('GET', path),
    post: (path: string, body: O) => fetcher('POST', path, body),
    delete: (path: string) => fetcher('DELETE', path),
  };
}
