import type { t } from './common';

/**
 * Ref: API handle.
 */
export type ConnectorRef = {
  readonly peer: t.PeerModel;
  select(target: ConnectorRefSelectTarget, focus?: boolean): void;
};
export type ConnectorRefSelectTarget = number | t.LabelListEdge;

/**
 * <Component>
 */
export type ConnectorProps = {
  peer: t.PeerModel;
  behavior?: t.ConnectorPropsBehavior;
  debug?: { renderCount?: t.RenderCountProps; name?: string };
  style?: t.CssValue;
  onReady?: t.ConnectorReadyHandler;
  onSelectionChange?: t.ConnectorSelectionHandler;
};

export type ConnectorPropsBehavior = {
  focusOnLoad?: boolean;
  grabFocusOnArrowKey?: boolean;
};

/**
 * Events
 */
export type ConnectorReadyHandler = (e: t.ConnectorRef) => void;

export type ConnectorSelectionHandler = (e: ConnectorSelectionHandlerArgs) => void;
export type ConnectorSelectionHandlerArgs = {
  peer: t.PeerModel;
  selection: { index: number; kind: t.ConnectorDataKind; peerid?: string };
};
