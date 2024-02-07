import type { t } from './common';

type Url = string;
type Percent = number; // 0..1

export type SpecListBadge = {
  image: Url;
  href: Url;
};

/**
 * <Component>
 */
export type SpecListProps = {
  title?: string;
  version?: string;
  specs?: t.SpecImports;
  selectedIndex?: number;
  href?: string;
  hrDepth?: number;
  badge?: t.SpecListBadge;
  allowRubberband?: boolean;
  showDevParam?: boolean;
  style?: t.CssValue;
  scroll?: boolean;
  scrollTo$?: t.Observable<t.SpecListScrollTarget>;
  onItemVisibility?: t.SpecListItemVisibilityHandler;
  onItemClick?: t.SpecListItemHandler;
  onItemSelect?: t.SpecListItemHandler;
};

/**
 * Passed through an observer to direct the component to scroll to a specific location.
 */
export type SpecListScrollTarget = { index: number };

/**
 * Fired when a list-item is scrolled into or out-of view.
 */
export type SpecListItemVisibilityHandler = (e: SpecListItemVisibilityHandlerArgs) => void;
export type SpecListItemVisibilityHandlerArgs = { children: SpecItemChildVisibility[] };
export type SpecItemChildVisibility = {
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

/**
 * Fired when a list-item is clicked.
 * NB: existence of this event-handler prop supresses the default <a> link click behavior.
 */
export type SpecListItemHandler = (e: SpecListItemHandlerArgs) => void;
export type SpecListItemHandlerArgs = {
  index: number;
  address?: string;
  imports: t.SpecImports;
  importer?: t.SpecImporter;
};
