import { Path, type t } from './common';
import { fetcher } from './Http.u.fetch';

type O = Record<string, unknown>;
type ModifyPath = (path: string) => string;
type FetchInput = t.HttpFetcher | t.HttpOptions;

/**
 * HTTP methods.
 */
export function methods(fetcher: FetchInput = {}): t.HttpFetchMethods {
  return toMethods(fetcher);
}

/**
 * HTTP methods for a specific host origin.
 */
export function origin(fetcher: FetchInput, domain: string): t.HttpFetchMethods {
  return toMethods(fetcher, (path) => Path.join(domain, path));
}

/**
 * Implementation
 */
function toMethods(input: FetchInput, modifyPath?: ModifyPath): t.HttpFetchMethods {
  const f: ModifyPath = (path) => (modifyPath ? modifyPath(path) : path);
  const fetch = wrangle.fetch(input);
  return {
    get: (path: string, params?: O) => fetch('GET', f(path), { params }),
    put: (path: string, body: O, params?: O) => fetch('PUT', f(path), { body, params }),
    post: (path: string, body: O, params?: O) => fetch('POST', f(path), { body, params }),
    patch: (path: string, body: O, params?: O) => fetch('PATCH', f(path), { body, params }),
    delete: (path: string, params?: O) => fetch('DELETE', f(path), { params }),
  };
}

/**
 * Helpers
 */
const wrangle = {
  fetch(input: FetchInput) {
    if (typeof input === 'function') return input;
    if (typeof input === 'object') return fetcher(input);
    throw new Error('Fetcher input not supporter');
  },
} as const;
