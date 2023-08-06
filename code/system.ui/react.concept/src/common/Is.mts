import type * as t from './types.mjs';

/**
 * Flags
 */
export const Is = {
  namespace(input: t.SlugListItem): input is t.SlugNamespace {
    if (!isObject(input)) return false;
    return 'namespace' in input && typeof input.namespace === 'string';
  },

  slug(input: t.SlugListItem): input is t.Slug {
    if (!isObject(input)) return false;
    return (
      'id' in input &&
      'kind' in input &&
      typeof input.id === 'string' &&
      typeof input.kind === 'string'
    );
  },
} as const;

/**
 * Helpers
 */
const isObject = (input: any): input is object => typeof input === 'object' && input !== null;
