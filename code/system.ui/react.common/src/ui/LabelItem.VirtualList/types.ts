import type { t } from './common';

type Index = number;
type LocationOptions = {
  align?: 'start' | 'center' | 'end';
  behavior?: 'smooth' | 'auto';
  offset?: number;
};

export type VirtialListScrollLocation = Index | 'Last';

/**
 * Programmatic API for controlling a list.
 */
export type VirtualListHandle = {
  scrollTo(location: VirtialListScrollLocation, options?: LocationOptions): void;
};

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
  vlist: VirtualListHandle;
};
