import type * as t from '../../common/types.mjs';

type O = Record<string, unknown>;

/**
 * Index of development tools (UI widgets).
 */
export type DevTools<S extends O = O> = {
  ctx: t.DevCtx;
  header: t.DevCtxDebugHeader;
  footer: t.DevCtxDebugFooter;

  button(label: string, onClick?: t.DevButtonClickHandler<S>): DevTools<S>;
  button(fn: t.DevButtonHandler<S>): DevTools<S>;
  boolean(fn: t.DevBooleanHandler<S>): DevTools<S>;
  hr(): DevTools<S>;
};
