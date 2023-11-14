import type * as t from './t';

export const Data = {
  /**
   * Convert type from normal JS array to include Automerge extensions.
   */
  array<T>(input: Array<T>): t.AutomergeArray<T> {
    return input as t.AutomergeArray<T>;
  },
} as const;
