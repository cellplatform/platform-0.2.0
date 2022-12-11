import * as t from '../common/types.mjs';

type Color = string | number;

export type SpecFillMode = 'fill' | 'fill-x' | 'fill-y';

export type SpecCtx = {
  display(value: SpecPropDisplay): SpecCtx;
  backgroundColor(value: Color): SpecCtx;
  backdropColor(value: Color): SpecCtx;

  size(width: number | undefined, height: number | undefined): SpecCtx;
  size(mode: SpecFillMode, margin?: t.MarginInput): SpecCtx;

  render(el: JSX.Element | undefined): SpecCtx;
  rerun(): void;
};

export type SpecPropDisplay = 'flex' | 'grid' | undefined;

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
