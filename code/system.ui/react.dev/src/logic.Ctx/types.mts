import * as t from '../common/types.mjs';

export type DevContext = t.Disposable & {
  readonly instance: t.DevInstance;
  readonly disposed: boolean;
  readonly pending: boolean;
  readonly ctx: t.DevCtx;
  flush(): Promise<DevContext>;
  refresh(): Promise<DevContext>;
  toObject(): t.DevCtxObject;
};

type O = Record<string, unknown>;

type Id = string;
type SpecId = Id;
type Color = string | number;
type IgnoredResponse = any | Promise<any>;

export type DevFillMode = 'fill' | 'fill-x' | 'fill-y';
export type DevPropDisplay = 'flex' | 'grid' | undefined;

/**
 * The context {ctx} interface passed into specs.
 */
export type DevCtx = {
  readonly component: DevCtxComponent;
  readonly host: DevCtxHost;
  readonly debug: DevCtxDebug;
  readonly initial: boolean; // Flag indicating if this is the initial run (or first run after a reset).
  toObject(): DevCtxObject;
  run(options?: { reset?: boolean; only?: SpecId | SpecId[] }): Promise<t.DevInfo>;
  reset(): Promise<t.DevInfo>;
  state<T extends O>(initial: T): Promise<DevCtxState<T>>;
};

export type DevCtxState<T extends O> = {
  current: T;
  change(fn: (draft: T) => IgnoredResponse): Promise<T>;
};

export type DevCtxObject = {
  instance: t.DevInstance;
  props: DevRenderProps;
  run: { count: number; initial: boolean };
};

export type DevCtxComponent = {
  render<T extends O = O>(fn: DevSubjectRenderer<T>): DevCtxComponent;
  display(value: DevPropDisplay): DevCtxComponent;
  backgroundColor(value?: Color): DevCtxComponent;
  size(width: number | undefined, height: number | undefined): DevCtxComponent;
  size(mode: DevFillMode, margin?: t.MarginInput): DevCtxComponent;
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
  /**
   * TODO 🐷
   * REMOVE {id}
   */
  id: string;
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
) => JSX.Element | undefined;
export type DevSubjectRendererArgs<T extends O = O> = { state: T };
