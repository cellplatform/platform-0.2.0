import type { t } from '../common.t';

export * from './Doc.Image/types.mjs';
export * from './Doc.Sidebar/types.mjs';

/**
 * Common context passed to each block.
 */
export type DocBlockCtx<N extends t.MdastNode> = {
  md: t.ProcessedMdast;
  node: N;
};
