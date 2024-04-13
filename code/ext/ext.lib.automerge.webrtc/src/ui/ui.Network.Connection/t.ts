import type { t } from './common';

/**
 * <Component>
 */
export type NetworkConnectionProps = {
  left?: t.NetworkConnectionEdge;
  right?: t.NetworkConnectionEdge;
  style?: t.CssValue;
};

/**
 * Edge
 */
export type NetworkConnectionEdgeKind = 'Left' | 'Right';
export type NetworkConnectionEdge = {
  kind: t.NetworkConnectionEdgeKind;
  network: t.NetworkStore;
};
