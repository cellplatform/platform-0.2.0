import type { t } from './common';

/**
 * <Component>
 */
export type CmdHostProps = {
  pkg: { name: string; version: string };
  imports?: t.ModuleImports;
  command?: string;
  commandPlaceholder?: string;
  applyFilter?: boolean;
  selectedIndex?: number;
  hintKey?: string | string[];
  hrDepth?: number;
  badge?: t.ModuleListBadge;
  enabled?: boolean;
  focused?: boolean;
  showParamDev?: boolean;
  autoGrabFocus?: boolean;
  listMinWidth?: number;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  focusOnReady?: boolean;
  focusOnClick?: boolean;
  scrollTo$?: t.Observable<t.ModuleListScrollTarget>;
  onReady?: CmdHostReadyHandler;
  onChanged?: CmdHostChangedHandler;
  onCmdFocusChange?: t.TextInputFocusHandler;
  onKeyDown?: t.TextInputKeyHandler;
  onKeyUp?: t.TextInputKeyHandler;
  onItemVisibility?: t.ModuleListItemVisibilityHandler;
  onItemClick?: t.ModuleListItemHandler;
  onItemSelect?: t.ModuleListItemHandler;
};

/**
 * Events
 */
export type CmdHostChangedHandler = (e: CmdHostChangedHandlerArgs) => void;
export type CmdHostChangedHandlerArgs = { command: string };

export type CmdHostReadyHandler = (e: CmdHostReadyHandlerArgs) => void;
export type CmdHostReadyHandlerArgs = { textbox: t.TextInputRef };
