import { slug } from './common';

export * from './u.Handle';
export * from './u.Wrangle';

/**
 * Mutation helpers.
 */
export const Mutate = {
  emptyChange(d: any) {
    const key = `__tmp:${slug()}`;
    d[key] = 0;
    delete d[key]; // Clean up.
  },
} as const;
