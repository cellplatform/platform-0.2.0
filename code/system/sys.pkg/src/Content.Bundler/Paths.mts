import * as t from '../common/types.mjs';

export const BundlePaths: t.BundlePaths = {
  latest: '.latest/',
  app: {
    base: 'app/',
    lib: 'app/lib/',
    data: 'app/data/',
  },
  data: {
    base: 'data/',
    md: 'md/',
    logfile: 'log.json',
  },
};
