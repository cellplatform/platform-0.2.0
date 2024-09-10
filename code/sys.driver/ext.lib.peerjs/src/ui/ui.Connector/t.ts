import type { t } from './common';

/**
 * Ref: API handle.
 */
export type ConnectorRef = Omit<t.LabelListDispatch, 'cmd'> & { readonly peer: t.PeerModel };
export type ConnectorBehavior = 'Focus.OnLoad' | 'Focus.OnArrowKey';

/**
 * <Component>
 */
export type ConnectorProps = {
  peer: t.PeerModel;
  behaviors?: t.ConnectorBehavior[];
  debug?: { renderCount?: t.RenderCountProps; name?: string };
  tabIndex?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onReady?: t.ConnectorReadyHandler;
  onSelectionChange?: t.ConnectorSelectionHandler;
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
