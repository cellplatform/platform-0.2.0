import type { t } from './common';
import type { VirtuosoHandle } from 'react-virtuoso';

/**
 * <Component>
 */
export type VirtualListProps = {
  list?: t.LabelListState;
  renderers?: t.LabelItemRenderers;
  style?: t.CssValue;
  onReady?: VirtualListReadyHandler;
};

/**
 * Events
 */
export type VirtualListReadyHandler = (e: VirtualListReadyHandlerArgs) => void;
export type VirtualListReadyHandlerArgs = {
  ref: VirtuosoHandle;
};
