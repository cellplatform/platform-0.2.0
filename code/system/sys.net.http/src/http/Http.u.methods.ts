import { Path, type t } from './common';

type O = Record<string, unknown>;
type ModifyPath = (path: string) => string;

/**
 * HTTP methods.
 */
export function methods(fetch: t.HttpFetcher): t.HttpFetchMethods {
  return toMethods(fetch);
}

/**
 * HTTP methods for a specific host origin.
 */
export function origin(fetch: t.HttpFetcher, domain: string): t.HttpFetchMethods {
  return toMethods(fetch, (p) => Path.join(domain, p));
}

/**
 * Implementation
 */
function toMethods(fetch: t.HttpFetcher, modifyPath?: ModifyPath): t.HttpFetchMethods {
  const f: ModifyPath = (path) => (modifyPath ? modifyPath(path) : path);
  return {
    get: (path: string, params?: O) => fetch('GET', f(path), { params }),
    put: (path: string, body: O, params?: O) => fetch('PUT', f(path), { body, params }),
    post: (path: string, body: O, params?: O) => fetch('POST', f(path), { body, params }),
    patch: (path: string, body: O, params?: O) => fetch('PATCH', f(path), { body, params }),
    delete: (path: string, params?: O) => fetch('DELETE', f(path), { params }),
  };
}
