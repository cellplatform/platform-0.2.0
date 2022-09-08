import { t } from './common/index.mjs';
import { FsDriverSpec as Driver } from './Driver.spec/index.mjs';

export const Spec = {
  Driver,

  every(ctx: t.SpecContext) {
    ctx.describe('Filesystem (Specification)', () => {
      Driver.every(ctx);
    });
  },
};
