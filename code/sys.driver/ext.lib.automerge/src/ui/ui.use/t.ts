import type { t } from './common';

type O = Record<string, unknown>;

/**
 * useDocs | useDoc
 */
export type UseDocsOptions = {
  timeout?: t.Msecs;
  redrawOnChange?: boolean | t.Msecs;
};

export type UseDocsError = { uri: t.UriString; type: UseDocsErrorType; message: string };
export type UseDocsErrorType = 'Timeout' | 'NotFound' | 'Unknown';

export type UseDocs<T extends O = O> = {
  readonly is: UseDocFlags;
  readonly refs: t.Doc<T>[];
  readonly fetching: t.UriString[];
  readonly errors: t.UseDocsError[];
};

export type UseDoc<T extends O = O> = {
  readonly is: UseDocFlags;
  readonly ref: t.Doc<T>;
  readonly fetching: t.UriString;
  readonly error: t.UseDocsError;
};

export type UseDocFlags = {
  readonly ok: boolean;
  readonly fetching: boolean;
  readonly ready: boolean;
};

/**
 * useRedraw
 */
export type UseRedrawOnChangeOptions = { debounce?: t.Msecs };
