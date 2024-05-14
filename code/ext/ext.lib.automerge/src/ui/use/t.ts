import type { t } from './common';

/**
 * useDocs
 */
export type UseDocsOptions = {
  timeout?: t.Msecs;
  redrawOnChange?: boolean | t.Msecs;
};

export type UseDocsError = { uri: t.UriString; type: UseDocsErrorType; message: string };
export type UseDocsErrorType = 'Timeout' | 'NotFound' | 'Unknown';

/**
 * useRedraw
 */
export type UseRedrawOnChangeOptions = { debounce?: t.Msecs };
