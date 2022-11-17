import * as t from '../common/types.mjs';

type Color = string | number | undefined;
type FillMode = 'fill';

export type SpecCtx = {
  display(value: SpecPropDisplay): SpecCtx;
  backgroundColor(value: Color): SpecCtx;
  backdropColor(value: Color): SpecCtx;

  size(width: number | undefined, height: number | undefined): SpecCtx;
  size(mode: FillMode, margin?: t.MarginInput): SpecCtx;

  render(el: JSX.Element | undefined): SpecCtx;
  rerun(): void;
};

export type SpecPropDisplay = 'flex' | 'grid' | undefined;

export type SpecRenderProps = {
  instance: { id: string };
  rerun$: t.Observable<void>;

  size?: SpecRenderSize;
  element?: JSX.Element;
  display?: t.SpecPropDisplay;
  backgroundColor?: Color;
  backdropColor?: Color;
};

export type SpecRenderSize = SpecRenderSizeCenter | SpecRenderSizeFill;

export type SpecRenderSizeCenter = {
  mode: 'center';
  width?: number;
  height?: number;
};

export type SpecRenderSizeFill = {
  mode: 'fill';
  margin: t.Margin;
};
