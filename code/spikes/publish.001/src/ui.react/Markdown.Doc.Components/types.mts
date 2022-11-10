import * as t from '../common/types.mjs';

export * from './Doc.Image/types.mjs';

/**
 * Common context passed to each block.
 */
export type DocBlockCtx<N extends t.MdastNode> = {
  md: t.ProcessedMdast;
  node: N;
};
