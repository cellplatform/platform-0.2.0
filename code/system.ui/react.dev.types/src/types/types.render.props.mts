import { type t } from './common';

type Color = string | number;

/**
 * Rendering state produced by the props.
 */
export type DevRenderProps = {
  component: DevRenderPropsComponent;
  host: DevRenderPropsHost;
  debug: DevRenderPropsDebug;
};

/**
 * Main Component ("Subject")
 */
export type DevRenderPropsComponent = {
  renderer?: t.DevRendererRef<any>;
  size?: DevRenderSize;
  display?: t.DevPropDisplay;
  backgroundColor?: Color;
};

/**
 * Component Host ("Harness")
 */
export type DevRenderPropsHost = {
  backgroundColor?: Color;
  tracelineColor?: Color;
};

/**
 * Debug Panel
 */
export type DevRenderPropsDebug = {
  width?: number;
  header: DevRenderPropsDebugBar;
  body: {
    renderers: t.DevRendererRef<any>[];
    scroll: boolean;
    padding: t.DevMargin;
  };
  footer: DevRenderPropsDebugBar;
};

export type DevRenderPropsDebugBar = {
  renderer?: t.DevRendererRef<any>;
  border: { color?: Color };
  padding: t.DevMargin;
};

/**
 * Size
 */
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
  margin: t.DevMargin;
};
