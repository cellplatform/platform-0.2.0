import type { t } from './common';

/**
 * Ref: API handle.
 */
export type ConnectorRef = t.LabelListDispatch & { readonly peer: t.PeerModel };

/**
 * <Component>
 */
export type ConnectorProps = {
  peer: t.PeerModel;
  behavior?: t.ConnectorBehavior;
  debug?: { renderCount?: t.RenderCountProps; name?: string };
  tabIndex?: number;
  style?: t.CssValue;
  onReady?: t.ConnectorReadyHandler;
  onSelectionChange?: t.ConnectorSelectionHandler;
};

export type ConnectorBehavior = {
  focusOnLoad?: boolean;
  focusOnArrowKey?: boolean;
};

/**
 * Events
 */
export type ConnectorReadyHandler = (e: ConnectorReadyHandlerArgs) => void;
export type ConnectorReadyHandlerArgs = { ref: t.ConnectorRef };

export type ConnectorSelectionHandler = (e: ConnectorSelectionHandlerArgs) => void;
export type ConnectorSelectionHandlerArgs = {
  peer: t.PeerModel;
  selection: { index: number; kind: t.ConnectorDataKind; peerid?: string };
};
