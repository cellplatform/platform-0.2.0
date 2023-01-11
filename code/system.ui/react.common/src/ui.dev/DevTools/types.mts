import { t } from '../../common.t';

type O = Record<string, unknown>;

/**
 * Index of development tools (UI widgets).
 */
export type DevTools<S extends O = O> = {
  ctx: t.DevCtx;
  header: t.DevCtxDebugHeader;
  footer: t.DevCtxDebugFooter;
  change: t.DevCtxState<S>['change'];

  button(label: string, onClick?: t.DevButtonClickHandler<S>): DevTools<S>;
  button(fn: t.DevButtonHandler<S>): DevTools<S>;

  boolean(fn: t.DevBooleanHandler<S>): DevTools<S>;

  title(text: string, style?: t.DevTitleStyle): DevTools<S>;
  title(fn: t.DevTitleHandler<S>): DevTools<S>;

  hr(): DevTools<S>;
};
