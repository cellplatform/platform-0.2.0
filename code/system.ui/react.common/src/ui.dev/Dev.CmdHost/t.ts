import type { t } from './common';

export type CmdHostChangedHandler = (e: CmdHostChangedHandlerArgs) => void;
export type CmdHostChangedHandlerArgs = { command: string };

/**
 * <Component>
 */
export type CmdHostProps = {
  pkg: { name: string; version: string };
  specs?: t.SpecImports;
  command?: string;
  commandPlaceholder?: string;
  applyFilter?: boolean;
  selectedIndex?: number;
  hintKey?: string | string[];
  hrDepth?: number;
  badge?: t.SpecListBadge;
  showDevParam?: boolean;
  style?: t.CssValue;
  focusOnReady?: boolean;
  scrollTo$?: t.Observable<t.SpecListScrollTarget>;
  onChanged?: t.CmdHostChangedHandler;
  onCmdFocusChange?: t.TextInputFocusChangeHandler;
  onKeyDown?: t.TextInputKeyEventHandler;
  onKeyUp?: t.TextInputKeyEventHandler;
  onItemVisibility?: t.SpecListItemVisibilityHandler;
  onItemClick?: t.SpecListItemHandler;
  onItemSelect?: t.SpecListItemHandler;
};
