import { type t } from './common';
import { DirSpec } from './Driver.Indexer.spec.Dir.mjs';
import { ManifestSpec } from './Driver.Indexer.spec.Manifest.mjs';

/**
 * Functional Specification: Indexer
 */
export const IndexerSpec = {
  DirSpec,
  ManifestSpec,

  every(ctx: t.SpecContext) {
    ctx.describe('Indexer (Specification)', () => {
      DirSpec(ctx);
      ManifestSpec(ctx);
    });
  },
};
