import { t } from './common';

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
  gridColor?: Color;
};

/**
 * Debug Panel
 */
export type DevRenderPropsDebug = {
  header: {
    renderer?: t.DevRendererRef<any>;
    border: DevRenderPropsDebugBorder;
    padding: t.Margin;
  };
  body: {
    renderers: t.DevRendererRef<any>[];
    scroll: boolean;
    padding: t.Margin;
  };
  footer: {
    renderer?: t.DevRendererRef<any>;
    border: DevRenderPropsDebugBorder;
    padding: t.Margin;
  };
};

export type DevRenderPropsDebugBorder = { color?: Color };

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
  margin: t.Margin;
};
