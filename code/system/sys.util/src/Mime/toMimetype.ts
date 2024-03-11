import { type t } from '../common';

export const TYPES = {
  BINARY: 'application/octet-stream',
};

/**
 * Convert a key-path into it's "content-type" (mimetype).
 * Refs:
 *    - https://en.wikipedia.org/wiki/Media_type
 *    - https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 *
 */
export const toMimetype: t.ToMimetype = (input, defaultType = '') => {
  input = (input || '').trim();

  if (input.endsWith('.js')) return 'application/javascript';
  if (input.endsWith('.wasm')) return 'application/wasm';
  if (input.endsWith('.json')) return 'application/json';
  if (input.endsWith('.css')) return 'text/css';
  if (input.endsWith('.png')) return 'image/png';
  if (input.endsWith('.jpg') || input.endsWith('.jpeg')) return 'image/jpeg';
  if (input.endsWith('.svg')) return 'image/svg+xml';
  if (input.endsWith('.gif')) return 'image/gif';
  if (input.endsWith('.webm')) return 'video/webm';
  if (input.endsWith('.pdf')) return 'application/pdf';
  if (input.endsWith('.yaml') || input.endsWith('.yml')) return 'text/plain';
  if (input.endsWith('.txt')) return 'text/plain';
  if (input.endsWith('.html') || input.endsWith('.htm')) return 'text/html';
  if (input.endsWith('.zip')) return 'application/zip';
  if (input.endsWith('.csv') || input.endsWith('.tsv')) return 'text/csv';

  return defaultType;
};
