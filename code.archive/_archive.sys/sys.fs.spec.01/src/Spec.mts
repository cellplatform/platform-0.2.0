import { type t } from './common';
import { FsDriverSpec as Driver } from './Driver.spec';

export const Spec = {
  Driver,

  every(ctx: t.SpecContext) {
    ctx.describe('Filesystem (Specification)', () => {
      Driver.every(ctx);
    });
  },
};
