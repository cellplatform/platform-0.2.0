import { glob, t } from '../../common/index.mjs';

/**
 * Reference:
 *    https://www.npmjs.com/package/glob
 */
const find: t.NodeGlobMatcher = (pattern) => {
  return new Promise<string[]>((resolve, reject) => {
    glob(pattern, (err, matches) => (err ? reject(err) : resolve(matches)));
  });
};

export const NodeGlob: t.NodeGlob = { find };
