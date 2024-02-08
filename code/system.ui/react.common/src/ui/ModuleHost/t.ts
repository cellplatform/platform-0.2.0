import type { t } from './common';

export type ModuleHostChangedHandler = (e: ModuleHostChangedHandlerArgs) => void;
export type ModuleHostChangedHandlerArgs = { command: string };

/**
 * <Component>
 */
export type ModuleHostProps<T = t.SpecModule> = {
  pkg: { name: string; version: string };
  imports?: t.ModuleImports<T>;
  command?: string;
  commandPlaceholder?: string;
  applyFilter?: boolean;
  selectedIndex?: number;
  hintKey?: string | string[];
  hrDepth?: number;
  badge?: t.ModuleListBadge;
  focused?: boolean;
  showParamDev?: boolean;
  style?: t.CssValue;
  focusOnReady?: boolean;
  scrollTo$?: t.Observable<t.ModuleListScrollTarget>;
  onChanged?: t.ModuleHostChangedHandler;
  onCmdFocusChange?: t.TextInputFocusChangeHandler;
  onKeyDown?: t.TextInputKeyEventHandler;
  onKeyUp?: t.TextInputKeyEventHandler;
  onItemVisibility?: t.ModuleListItemVisibilityHandler;
  onItemClick?: t.ModuleListItemHandler;
  onItemSelect?: t.ModuleListItemHandler;
};
