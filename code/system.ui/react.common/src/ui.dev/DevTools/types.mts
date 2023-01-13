import type { t } from '../../common.t';

type O = Record<string, unknown>;

/**
 * Index of development tools (UI widgets).
 */
export type DevTools<S extends O = O> = {
  ctx: t.DevCtx;
  change: t.DevCtxState<S>['change'];

  header: t.DevCtxDebugHeader;
  footer: t.DevCtxDebugFooter;
  row: t.DevCtxDebug['row'];

  /**
   * Helpers.
   */
  lorem(words?: number, endWith?: string): string;
  theme(value: t.DevTheme): DevTools<S>;

  /**
   * Widgets.
   */
  button(label: string, onClick?: t.DevButtonClickHandler<S>): DevTools<S>;
  button(fn: t.DevButtonHandler<S>): DevTools<S>;

  boolean(fn: t.DevBooleanHandler<S>): DevTools<S>;

  title(text: string, style?: t.DevTitleStyle): DevTools<S>;
  title(fn: t.DevTitleHandler<S>): DevTools<S>;

  TODO(text?: string, style?: t.DevTodoStyle): DevTools<S>;
  TODO(fn: t.DevTodoHandler<S>): DevTools<S>;

  hr(): DevTools<S>;
};
