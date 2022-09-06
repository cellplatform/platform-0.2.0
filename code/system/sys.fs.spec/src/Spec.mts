import { t } from './common/index.mjs';
import { FsDriverSpec as Driver } from './Driver.spec/index.mjs';

export const FilesystemSpec = {
  Driver,

  every(ctx: t.SpecContext) {
    Driver.every(ctx);
  },
};
