import { type t } from './common';

type Id = string;
type SpecId = Id;
type Color = string | number;
type O = Record<string, unknown>;
type NumberOrNil = number | null | undefined;

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
  readonly dispose$: t.Observable<any>;
  readonly subject: DevCtxSubject;
  readonly host: DevCtxHost;
  readonly debug: DevCtxDebug;
  readonly is: DevCtxIs;
  toObject(): DevCtxObject;
  run(options?: { reset?: boolean; only?: SpecId | SpecId[] }): Promise<t.DevInfo>;
  redraw(): Promise<void>;
  state<T extends O>(initial: T): Promise<DevCtxState<T>>;
};

export type DevCtxIs = {
  readonly initial: boolean; // Flag indicating if this is the initial run (or first run after a reset).
};

export type DevCtxStateMutator<T extends O> = (draft: T) => t.IgnoredResponse;
export type DevCtxState<T extends O> = {
  current: T;
  change(fn: DevCtxStateMutator<T>): Promise<T>;
};

export type DevCtxObject = {
  readonly id: Id;
  readonly instance: t.DevInstance;
  readonly props: t.DevRenderProps;
  readonly run: { count: number; is: DevCtxIs };
};

/**
 * Component (aka. "the main Subject")
 */
export type DevCtxSubject = {
  display(value: DevPropDisplay): DevCtxSubject;
  backgroundColor(value?: Color): DevCtxSubject;
  size(value: [NumberOrNil, NumberOrNil]): DevCtxSubject;
  size(mode: DevFillMode, margin?: t.DevMarginInput): DevCtxSubject;
  render<T extends O = O>(fn: t.DevRenderer<T>): DevCtxSubject;
};

/**
 * Subject Component Host ("Harness")
 */
export type DevCtxHost = {
  backgroundColor(value: Color | null): DevCtxHost;
  backgroundImage(value: t.DevBackgroundImageInput | t.UrlString | null): DevCtxHost;
  tracelineColor(value: Color | null): DevCtxHost;
};

/**
 * Debug Panel
 */
export type DevCtxDebug<S extends O = O> = {
  row<T extends O = S>(input: t.DevRenderer<T> | JSX.Element): t.DevRenderRef;
  scroll(value: boolean): DevCtxDebug;
  padding(value: t.DevMarginInput | undefined | null): DevCtxDebug;
  width(value: number): DevCtxDebug;
  header: DevCtxHeader<S>;
  footer: DevCtxFooter<S>;
};

export type DevCtxHeader<S extends O = O> = {
  render<T extends O = S>(input: t.DevRenderer<T> | JSX.Element): DevCtxHeader;
  border(color: Color | null): DevCtxHeader;
  padding(value: t.DevMarginInput | undefined | null): DevCtxHeader;
};

export type DevCtxFooter<S extends O = O> = {
  render<T extends O = S>(input: t.DevRenderer<T> | JSX.Element): DevCtxFooter;
  border(color: Color | null): DevCtxFooter;
  padding(value: t.DevMarginInput | undefined | null): DevCtxFooter;
};
