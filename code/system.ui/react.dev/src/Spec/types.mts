import * as t from '../common/types.mjs';

type Color = string | number;

export type SpecFillMode = 'fill' | 'fill-x' | 'fill-y';
export type SpecPropDisplay = 'flex' | 'grid' | undefined;

export type SpecCtx = {
  rerun(): void;
  readonly component: SpecCtxComponent;
  readonly host: SpecCtxHost;
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

export type SpecRenderArgs = {
  instance: { id: string };
  rerun$: t.Observable<void>;

  component: {
    size?: SpecRenderSize;
    element?: JSX.Element;
    display?: t.SpecPropDisplay;
    backgroundColor?: Color;
  };

  host: {
    backgroundColor?: Color;
  };
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
