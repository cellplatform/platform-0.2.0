import * as t from '../common/types.mjs';

type O = Record<string, unknown>;
type Id = string;
type SpecId = Id;
type Color = string | number;
type IgnoredResponse = any | Promise<any>;

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
  change(fn: (draft: T) => IgnoredResponse): Promise<T>;
};

export type DevCtxObject = {
  readonly id: Id;
  readonly instance: t.DevInstance;
  readonly props: DevRenderProps;
  readonly run: { count: number; is: DevCtxIs };
};

export type DevCtxComponent = {
  display(value: DevPropDisplay): DevCtxComponent;
  backgroundColor(value?: Color): DevCtxComponent;
  size(width: number | undefined, height: number | undefined): DevCtxComponent;
  size(mode: DevFillMode, margin?: t.MarginInput): DevCtxComponent;
  render<T extends O = O>(fn: DevSubjectRenderer<T>): DevCtxComponent;
};

export type DevCtxHost = {
  backgroundColor(value?: Color): DevCtxHost;
};

export type DevCtxDebug = {
  render<T extends O = O>(fn: DevSubjectRenderer<T>): DevCtxDebug;
};

/**
 * Rendering state produced by the props.
 */
export type DevRenderProps = {
  component: DevRenderPropsComponent;
  host: DevRenderPropsHost;
  debug: DevRenderPropsDebug;
};

export type DevRenderPropsComponent = {
  renderer?: DevSubjectRenderer<any>;
  size?: DevRenderSize;
  display?: t.DevPropDisplay;
  backgroundColor?: Color;
};

export type DevRenderPropsHost = {
  backgroundColor?: Color;
};

export type DevRenderPropsDebug = {
  main: { renderers: DevSubjectRenderer<any>[] };
};

export type DevRenderSize = DevRenderSizeCenter | DevRenderSizeFill;
export type DevRenderSizeCenter = {
  mode: 'center';
  width?: number;
  height?: number;
};
export type DevRenderSizeFill = {
  mode: 'fill';
  x: boolean;
  y: boolean;
  margin: t.Margin;
};

/**
 * Function that returns a renderable element.
 */
export type DevSubjectRenderer<T extends O = O> = (
  args: DevSubjectRendererArgs<T>,
) => JSX.Element | undefined | null;
export type DevSubjectRendererArgs<T extends O = O> = { state: T };
