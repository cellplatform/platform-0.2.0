import { t } from './common';

type Id = string;
type SpecId = Id;
type Color = string | number;
type O = Record<string, unknown>;

/**
 * Context wrapper that manages a {ctx} object passed
 * into running spec.
 */
export type DevContext = t.Disposable & {
  readonly instance: t.DevInstance;
  readonly disposed: boolean;
  readonly pending: boolean;
  readonly ctx: t.DevCtx;
  flush(): Promise<DevContext>;
  refresh(): Promise<DevContext>;
  toObject(): t.DevCtxObject;
};

export type DevFillMode = 'fill' | 'fill-x' | 'fill-y';
export type DevPropDisplay = 'flex' | 'grid' | undefined;
export type DevCtxInput = t.DevCtx | t.TestHandlerArgs;

/**
 * The context {ctx} interface passed into specs.
 */
export type DevCtx = {
  readonly component: DevCtxComponent;
  readonly host: DevCtxHost;
  readonly debug: DevCtxDebug;
  readonly is: DevCtxIs;
  toObject(): DevCtxObject;
  run(options?: { reset?: boolean; only?: SpecId | SpecId[] }): Promise<t.DevInfo>;
  state<T extends O>(initial: T): Promise<DevCtxState<T>>;
};

export type DevCtxIs = {
  readonly initial: boolean; // Flag indicating if this is the initial run (or first run after a reset).
};

export type DevCtxState<T extends O> = {
  current: T;
  change(fn: (draft: T) => t.IgnoredResponse): Promise<T>;
};

export type DevCtxObject = {
  readonly id: Id;
  readonly instance: t.DevInstance;
  readonly props: t.DevRenderProps;
  readonly run: { count: number; is: DevCtxIs };
};

export type DevCtxComponent = {
  display(value: DevPropDisplay): DevCtxComponent;
  backgroundColor(value?: Color): DevCtxComponent;
  size(width?: number | null, height?: number | null): DevCtxComponent;
  size(mode: DevFillMode, margin?: t.MarginInput): DevCtxComponent;
  render<T extends O = O>(fn: t.DevRenderer<T>): DevCtxComponent;
};

export type DevCtxHost = {
  backgroundColor(value?: Color): DevCtxHost;
};

export type DevCtxDebug = {
  row<T extends O = O>(input: t.DevRenderer<T> | JSX.Element): t.DevRenderRef;
  scroll(value: boolean): DevCtxDebug;
};
