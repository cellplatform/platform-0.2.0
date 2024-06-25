import { R } from './common';

export const Sort = {
  createdAt: {
    asc: R.sortBy(R.prop('createdAt')),
    desc: <T>(items: T[]) => R.reverse(Sort.createdAt.asc(items)),
  },
} as const;
