import * as t from '../common/types.mjs';

type Color = string | number;

export type SpecFillMode = 'fill' | 'fill-x' | 'fill-y';
export type SpecPropDisplay = 'flex' | 'grid' | undefined;

/**
 * Context API.
 */
export type SpecCtx = {
  readonly component: SpecCtxComponent;
  readonly host: SpecCtxHost;
  readonly debug: SpecCtxDebug;
  rerun(): void;
  toObject(): SpecCtxObject;
};

export type SpecCtxObject = {
  component: SpecRenderArgsComponent;
  host: SpecRenderArgsHost;
  debug: SpecRenderArgsDebug;
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
  TEMP(el: JSX.Element): SpecCtxDebug;
};

/**
 * Rendering Argument State
 */
export type SpecRenderArgs = {
  instance: { id: string };
  rerun$: t.Observable<void>;
  component: SpecRenderArgsComponent;
  host: SpecRenderArgsHost;
  debug: SpecRenderArgsDebug;
};

export type SpecRenderArgsComponent = {
  element?: JSX.Element;
  size?: SpecRenderSize;
  display?: t.SpecPropDisplay;
  backgroundColor?: Color;
};

export type SpecRenderArgsHost = {
  backgroundColor?: Color;
};

export type SpecRenderArgsDebug = {
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
