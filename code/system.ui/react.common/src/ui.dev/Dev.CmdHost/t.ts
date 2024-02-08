import type { t } from './common';

export type CmdHostChangedHandler = (e: CmdHostChangedHandlerArgs) => void;
export type CmdHostChangedHandlerArgs = { command: string };

/**
 * <Component>
 */
export type CmdHostProps<T = t.SpecModule> = {
  pkg: { name: string; version: string };
  specs?: t.ModuleImports<T>;
  command?: string;
  commandPlaceholder?: string;
  applyFilter?: boolean;
  selectedIndex?: number;
  hintKey?: string | string[];
  hrDepth?: number;
  badge?: t.ModuleListBadge;
  showDevParam?: boolean;
  style?: t.CssValue;
  focusOnReady?: boolean;
  scrollTo$?: t.Observable<t.ModuleListScrollTarget>;
  onChanged?: t.CmdHostChangedHandler;
  onCmdFocusChange?: t.TextInputFocusChangeHandler;
  onKeyDown?: t.TextInputKeyEventHandler;
  onKeyUp?: t.TextInputKeyEventHandler;
  onItemVisibility?: t.ModuleListItemVisibilityHandler;
  onItemClick?: t.ModuleListItemHandler;
  onItemSelect?: t.ModuleListItemHandler;
};
