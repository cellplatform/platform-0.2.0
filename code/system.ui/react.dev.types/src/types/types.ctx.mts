import { t } from './common';

type O = Record<string, unknown>;
type Id = string;
type SpecId = Id;
type Color = string | number;

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
  readonly props: DevRenderProps;
  readonly run: { count: number; is: DevCtxIs };
};

export type DevCtxComponent = {
  display(value: DevPropDisplay): DevCtxComponent;
  backgroundColor(value?: Color): DevCtxComponent;
  size(width: number | undefined, height: number | undefined): DevCtxComponent;
  size(mode: DevFillMode, margin?: t.MarginInput): DevCtxComponent;
  render<T extends O = O>(fn: DevRenderer<T>): DevCtxComponent;
};

export type DevCtxHost = {
  backgroundColor(value?: Color): DevCtxHost;
};

export type DevCtxDebug = {
  render<T extends O = O>(fn: DevRenderer<T>): DevRenderRef;
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
  renderer?: DevRendererRef<any>;
  size?: DevRenderSize;
  display?: t.DevPropDisplay;
  backgroundColor?: Color;
};

export type DevRenderPropsHost = {
  backgroundColor?: Color;
};

export type DevRenderPropsDebug = {
  main: { renderers: DevRendererRef<any>[] };
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
export type DevRenderer<T extends O = O> = (
  args: DevRendererArgs<T>,
) => JSX.Element | undefined | null;
export type DevRendererArgs<T extends O = O> = { state: T };

/**
 * Response to the assignment of a renderer that provides
 * hooks for re-drawing the component.
 */
export type DevRenderRef = { id: Id; redraw(): void };
export type DevRendererRef<T extends O = O> = { id: Id; fn: DevRenderer<T> };
