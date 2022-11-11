import * as t from '../common/types.mjs';

type ColorValue = string | number | undefined;

export type SpecCtx = {
  render(el: JSX.Element | undefined): SpecCtx;
  width(value: number | undefined): SpecCtx;
  height(value: number | undefined): SpecCtx;
  size(width: number | undefined, height: number | undefined): SpecCtx;
  display(value: SpecPropDisplay): SpecCtx;
  backgroundColor(value: ColorValue): SpecCtx;
};

export type SpecPropDisplay = 'flex' | 'grid' | undefined;

export type SpecRenderProps = {
  element?: JSX.Element;
  width?: number;
  height?: number;
  display?: t.SpecPropDisplay;
  backgroundColor?: ColorValue;
};
