import { Path, type t } from './common';
import { fetcher } from './Http.u.fetch';

type O = Record<string, unknown>;
type ModifyPath = (path: string) => string;

/**
 * HTTP methods.
 */
export function methods(fetcher: t.HttpFetchInput = {}): t.HttpMethods {
  return toMethods(fetcher);
}

/**
 * HTTP methods for a specific host origin.
 */
export function origin(fetcher: t.HttpFetchInput, domain: string): t.HttpMethods {
  return toMethods(fetcher, (path) => Path.join(domain, path));
}

/**
 * Implementation
 */
function toMethods(input: t.HttpFetchInput, modifyPath?: ModifyPath): t.HttpMethods {
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
  fetch(input: t.HttpFetchInput) {
    if (typeof input === 'function') return input;
    if (typeof input === 'object') return fetcher(input);
    throw new Error('Fetcher input not supporter');
  },
} as const;
