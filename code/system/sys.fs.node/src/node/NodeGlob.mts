import { glob, t } from '../common';

/**
 * Reference:
 *    https://www.npmjs.com/package/glob
 */
const find: t.NodeGlobMatcher = (pattern, options: {} = {}) => {
  return new Promise<string[]>((resolve, reject) => {
    glob(pattern, options, (err, matches) => (err ? reject(err) : resolve(matches)));
  });
};

export const NodeGlob: t.NodeGlob = { find };
