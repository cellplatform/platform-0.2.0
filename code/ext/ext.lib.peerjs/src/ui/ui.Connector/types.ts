import type { t } from './common';

/**
 * <Component>
 */
export type ConnectorProps = {
  peer?: t.PeerModel;
  debug?: { renderCount?: t.RenderCountProps };
  behavior?: t.ConnectorPropsBehavior;
  style?: t.CssValue;
  onReady?: t.ConnectorReadyHandler;
};

export type ConnectorPropsBehavior = {
  grabFocusOnArrowKey?: boolean;
};

/**
 * Events
 */
export type ConnectorReadyHandler = (e: ConnectorReadyHandlerArgs) => void;
export type ConnectorReadyHandlerArgs = {
  peer: t.PeerModel;
  list: t.LabelListState;
};
