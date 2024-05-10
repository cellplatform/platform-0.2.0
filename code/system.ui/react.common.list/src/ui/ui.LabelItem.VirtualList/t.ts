import type { t } from './common';

type Index = number;
type LocationOptions = {
  align?: 'start' | 'center' | 'end';
  behavior?: 'smooth' | 'auto';
  offset?: number;
};

export type VirtialListScrollLocation = Index | 'Last';

/**
 * Programmatic API for controlling a list imperatively.
 * Usage (either):
 *    1. onReady(e)
 *    2. ref={useRef<VirtualListRef>()}
 */
export type VirtualListRef = t.LabelListDispatch & {
  scrollTo(location: VirtialListScrollLocation, options?: LocationOptions): void;
};

/**
 * <Component>
 */
export type VirtualListProps = {
  list?: t.LabelListState;
  renderers?: t.LabelItemRenderers;
  overscan?: number;
  tabIndex?: number;
  style?: t.CssValue;
  onReady?: VirtualListReadyHandler;
};

/**
 * Events
 */
export type VirtualListReadyHandler = (e: VirtualListRef) => void;
