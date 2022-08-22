import { ToMimetype } from './types.mjs';
export declare const TYPES: {
    BINARY: string;
};
/**
 * Convert a key-path into it's "content-type" (mimetype).
 * Refs:
 *    - https://en.wikipedia.org/wiki/Media_type
 *    - https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 *
 */
export declare const toMimetype: ToMimetype;
