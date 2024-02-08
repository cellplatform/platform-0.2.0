import type { t } from './common';

type Url = string;
type Percent = number; // 0..1

export type ModuleListBadge = { image: Url; href: Url };

/**
 * <Component>
 */
export type ModuleListProps<T = unknown> = {
  title?: string;
  version?: string;
  imports?: t.ModuleImports<T>;
  selectedIndex?: number;
  href?: string;
  hrDepth?: number;
  badge?: t.ModuleListBadge;
  allowRubberband?: boolean;
  focused?: boolean;
  showParamDev?: boolean;
  style?: t.CssValue;
  scroll?: boolean;
  scrollTo$?: t.Observable<t.ModuleListScrollTarget>;
  onItemVisibility?: t.ModuleListItemVisibilityHandler;
  onItemClick?: t.ModuleListItemHandler;
  onItemSelect?: t.ModuleListItemHandler;
};

/**
 * Passed through an observer to direct the component to scroll to a specific location.
 */
export type ModuleListScrollTarget = { index: number };

/**
 * Fired when a list-item is scrolled into or out-of view.
 */
export type ModuleListItemVisibilityHandler = (e: ModuleListItemVisibilityHandlerArgs) => void;
export type ModuleListItemVisibilityHandlerArgs = { children: ModuleListItemVisibility[] };
export type ModuleListItemVisibility = {
  index: number;
  isVisible: boolean;
  threshold: Percent | [Percent, Percent, Percent, Percent];
};

/**
 * Fired when a list-item changes it's ready state.
 */
export type ModuleListItemReadyHandler = (e: ModuleListItemReadyHandlerArgs) => void;
export type ModuleListItemReadyHandlerArgs = {
  index: number;
  lifecycle: 'ready' | 'disposed';
  el?: HTMLLIElement;
};

/**
 * Fired when a list-item is clicked.
 * NB: existence of this event-handler prop supresses the default <a> link click behavior.
 */
export type ModuleListItemHandler = (e: ModuleListItemHandlerArgs) => void;
export type ModuleListItemHandlerArgs = {
  index: number;
  address?: string;
  importer?: t.SpecImporter;
};
