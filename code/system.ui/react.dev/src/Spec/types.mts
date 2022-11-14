import * as t from '../common/types.mjs';

type Color = string | number | undefined;
type Margin = number | [number, number] | [number, number, number, number];

export type SpecCtx = {
  render(el: JSX.Element | undefined): SpecCtx;
  size(width: number | undefined, height: number | undefined): SpecCtx;
  size(mode: 'fill', margin?: Margin): SpecCtx;
  display(value: SpecPropDisplay): SpecCtx;
  backgroundColor(value: Color): SpecCtx;
  backdropColor(value: Color): SpecCtx;
};

export type SpecPropDisplay = 'flex' | 'grid' | undefined;

export type SpecRenderProps = {
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
  margin: [number, number, number, number];
};
