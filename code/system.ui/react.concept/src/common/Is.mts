import type * as t from './types.mjs';

/**
 * Flags
 */
export const Is = {
  namespace(input?: t.SlugListItem): input is t.SlugNamespace {
    if (!isObject(input)) return false;
    return input.kind === 'slug:namespace' && typeof input.namespace === 'string';
  },

  slug(input?: t.SlugListItem): input is t.Slug {
    if (!isObject(input)) return false;
    return input.kind === 'slug:VideoDiagram' && typeof input.id === 'string';
  },

  slugImage(input?: any): input is t.SlugImage {
    if (!isObject(input)) return false;
    return typeof input.src === 'string';
  },
} as const;

/**
 * Helpers
 */
const isObject = (input: any): input is Object => typeof input === 'object' && input !== null;
