import type { t } from './common';
export type * from './t.Config';

export type CanvasBehavior = 'Foo' | 'Bar';

/**
 * Component
 */
export type CanvasProps = {
  behaviors?: t.CanvasBehavior[];
  store?: t.TLStoreWithStatus;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
