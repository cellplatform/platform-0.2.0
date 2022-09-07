import { t } from './common.mjs';
import { FsIOSpec as IO } from './Driver.IO.spec.mjs';
import { FsIndexerSpec as Indexer } from './Driver.Indexer.spec.mjs';

/**
 * Functional specification for modules implementing
 * the <FsDriver> type.
 */
export const FsDriverSpec = {
  IO,
  Indexer,

  every(ctx: t.SpecContext) {
    IO.every(ctx);
    Indexer.every(ctx);
  },
};
