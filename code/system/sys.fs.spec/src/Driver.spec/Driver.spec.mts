import { type t } from './common';
import { IOSpec as IO } from './Driver.IO.spec.mjs';
import { IndexerSpec as Indexer } from './Driver.Indexer.spec.mjs';

/**
 * Functional specification for modules implementing
 * the <FsDriver> type.
 */
export const FsDriverSpec = {
  IO,
  Indexer,

  every(ctx: t.SpecContext) {
    ctx.describe('Driver (Specification)', () => {
      IO.every(ctx);
      Indexer.every(ctx);
    });
  },
};
