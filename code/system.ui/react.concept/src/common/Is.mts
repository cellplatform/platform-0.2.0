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
} as const;

/**
 * Helpers
 */
const isObject = (input: any): input is object => typeof input === 'object' && input !== null;
