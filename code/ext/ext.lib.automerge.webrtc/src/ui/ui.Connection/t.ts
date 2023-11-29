import type { t } from './common';

/**
 * <Component>
 */
export type ConnectionProps = {
  left?: t.ConnectionEdge;
  right?: t.ConnectionEdge;
  style?: t.CssValue;
};

/**
 * Edge
 */
export type ConnectionEdgeKind = 'Left' | 'Right';
export type ConnectionEdge = {
  kind: t.ConnectionEdgeKind;
  network: t.WebrtcStore;
};
