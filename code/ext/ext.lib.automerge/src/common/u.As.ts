import type * as t from './t';

export const As = {
  array<T>(input: T[]): t.AutomergeArray<T> {
    if (!Array.isArray(input)) throw new Error('Not an array');
    const array = input as unknown as t.AutomergeArray<T>;
    if (typeof array.deleteAt !== 'function') throw new Error('Not an automerge array');
    return array;
  },
} as const;
