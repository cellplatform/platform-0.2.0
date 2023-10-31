import type { t } from './common';

/**
 * <Component>
 */
export type ConnectorProps = {
  peer?: t.PeerModel;
  behavior?: t.ConnectorPropsBehavior;
  debug?: { renderCount?: t.RenderCountProps; name?: string };
  style?: t.CssValue;
  onReady?: t.ConnectorReadyHandler;
};

export type ConnectorPropsBehavior = {
  focusOnLoad?: boolean;
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
