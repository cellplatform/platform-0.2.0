import * as t from '../common/types.mjs';

type Id = string;
type TestId = Id;
type SuiteId = Id;
type Color = string | number;

export type SpecFillMode = 'fill' | 'fill-x' | 'fill-y';
export type SpecPropDisplay = 'flex' | 'grid' | undefined;

/**
 * Context API.
 */
export type SpecContext = t.Disposable & {
  ctx: SpecCtx;
  props: SpecRenderProps;
};

export type SpecCtx = {
  readonly component: SpecCtxComponent;
  readonly host: SpecCtxHost;
  readonly debug: SpecCtxDebug;
  toObject(): SpecCtxObject;
  run(target?: TestId | SuiteId | (TestId | SuiteId)[]): Promise<t.DevInfo>;
};

export type SpecCtxObject = {
  instance: t.DevInstance;
  props: SpecRenderProps;
};

export type SpecCtxComponent = {
  render(el: JSX.Element | undefined): SpecCtxComponent;
  display(value: SpecPropDisplay): SpecCtxComponent;
  backgroundColor(value?: Color): SpecCtxComponent;
  size(width: number | undefined, height: number | undefined): SpecCtxComponent;
  size(mode: SpecFillMode, margin?: t.MarginInput): SpecCtxComponent;
};

export type SpecCtxHost = {
  backgroundColor(value?: Color): SpecCtxHost;
};

export type SpecCtxDebug = {
  /**
   * TODO 🐷
   */
  TEMP(el: JSX.Element): SpecCtxDebug;
};

/**
 * Rendering Argument State
 */
export type SpecRenderProps = {
  id: string;
  component: SpecRenderPropsComponent;
  host: SpecRenderPropsHost;
  debug: SpecRenderPropsDebug;
};

export type SpecRenderPropsComponent = {
  element?: JSX.Element;
  size?: SpecRenderSize;
  display?: t.SpecPropDisplay;
  backgroundColor?: Color;
};

export type SpecRenderPropsHost = {
  backgroundColor?: Color;
};

export type SpecRenderPropsDebug = {
  main: { elements: JSX.Element[] };
};

export type SpecRenderSize = SpecRenderSizeCenter | SpecRenderSizeFill;
export type SpecRenderSizeCenter = {
  mode: 'center';
  width?: number;
  height?: number;
};
export type SpecRenderSizeFill = {
  mode: 'fill';
  x: boolean;
  y: boolean;
  margin: t.Margin;
};
