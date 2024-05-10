import { glob, t } from '../common';

/**
 * Reference:
 *    https://www.npmjs.com/package/glob
 */
const find: t.NodeGlobMatcher = async (pattern, options = {}) => {
  return (await glob(pattern, options)) as string[];
};

export const NodeGlob: t.NodeGlob = { find };
