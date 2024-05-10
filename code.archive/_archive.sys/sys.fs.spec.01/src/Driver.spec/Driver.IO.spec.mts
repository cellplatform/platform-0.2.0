import { type t } from './common';
import { CopySpec } from './Driver.IO.spec.Copy.mjs';
import { DeleteSpec } from './Driver.IO.spec.Delete.mjs';
import { ExceptionsSpec } from './Driver.IO.spec.Exceptions.mjs';
import { InfoSpec } from './Driver.IO.spec.Info.mjs';
import { ReadWriteSpec } from './Driver.IO.spec.ReadWrite.mjs';
import { ResolveSpec } from './Driver.IO.spec.Resolve.mjs';

/**
 * Functional Specification: Driver (I/O)
 */
export const IOSpec = {
  ResolveSpec,
  InfoSpec,
  ReadWriteSpec,
  CopySpec,
  DeleteSpec,
  ExceptionsSpec,

  every(ctx: t.SpecContext) {
    ctx.describe('I/O (Specification)', () => {
      ResolveSpec(ctx);
      InfoSpec(ctx);
      ReadWriteSpec(ctx);
      CopySpec(ctx);
      DeleteSpec(ctx);
      ExceptionsSpec(ctx);
    });
  },
};
