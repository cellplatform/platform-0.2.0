import { t } from './common';

type Id = string;
type RendererId = Id;
type Color = string | number;
type O = Record<string, unknown>;
type RenderedResult = JSX.Element | undefined | null;

/**
 * Function that returns a renderable element.
 */
export type DevRenderer<T extends O = O> = (
  args: DevRendererArgs<T>,
) => RenderedResult | Promise<RenderedResult>;
export type DevRendererArgs<T extends O = O> = { id: RendererId; state: T };

/**
 * Response to the assignment of a renderer that provides
 * hooks for re-drawing the component.
 */
export type DevRenderRef = { id: Id; redraw(): void };
export type DevRendererRef<T extends O = O> = { id: RendererId; fn: DevRenderer<T> };

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
