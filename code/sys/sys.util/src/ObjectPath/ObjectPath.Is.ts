import { type t } from './common';

/**
 * Flag helpers.
 */
export const Is = {
  path(input: any): input is t.ObjectPath {
    if (!Array.isArray(input)) return false;
    return input.every((item) => typeof item === 'string' || typeof item === 'number');
  },
} as const;
