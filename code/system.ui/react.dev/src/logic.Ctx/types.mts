import * as t from '../common/types.mjs';

export type DevContext = t.Disposable & {
  readonly instance: t.DevInstance;
  readonly disposed: boolean;
  readonly pending: boolean;
  readonly ctx: t.SpecCtx;
  flush(): Promise<DevContext>;
  refresh(): Promise<DevContext>;
  toObject(): t.SpecCtxObject;
};
