import type { t } from './common';

/**
 * <Component>
 */
export type ConnectorProps = {
  peer?: t.PeerModel;
  debug?: { renderCount?: t.RenderCountProps };
  style?: t.CssValue;
  onReady?: ConnectorReadyHandler;
};

/**
 * Events
 */
export type ConnectorReadyHandler = (e: ConnectorReadyHandlerArgs) => void;
export type ConnectorReadyHandlerArgs = {
  peer: t.PeerModel;
  list: t.LabelListState;
};
