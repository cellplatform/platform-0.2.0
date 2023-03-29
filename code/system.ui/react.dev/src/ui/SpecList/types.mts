type Url = string;
type Percent = number; // 0..1

export type SpecListBadge = {
  image: Url;
  href: Url;
};

/**
 * Passed through an observer to direct the component to scroll to a specific location.
 */
export type SpecListScrollTarget = { index: number };

/**
 * Fired when a list-item is scrolled into or out-of view.
 */
export type SpecListChildVisibilityHandler = (e: SpecListChildVisibilityHandlerArgs) => void;
export type SpecListChildVisibilityHandlerArgs = { children: SpecListChildVisibility[] };
export type SpecListChildVisibility = {
  index: number;
  isVisible: boolean;
  threshold: Percent | [Percent, Percent, Percent, Percent];
};

/**
 * Fired when a list-item changes it's ready state.
 */
export type SpecListItemReadyHandler = (e: SpecListItemReadyHandlerArgs) => void;
export type SpecListItemReadyHandlerArgs = {
  index: number;
  lifecycle: 'ready' | 'disposed';
  el?: HTMLLIElement;
};
