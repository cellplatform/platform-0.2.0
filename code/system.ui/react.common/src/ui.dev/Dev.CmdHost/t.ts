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
  applyFilter?: boolean;
  selectedIndex?: number;
  hintKey?: string | string[];
  hrDepth?: number;
  badge?: t.SpecListBadge;
  style?: t.CssValue;
  focusOnReady?: boolean;
  scrollTo$?: t.Observable<t.SpecListScrollTarget>;
  onChanged?: t.CmdHostChangedHandler;
  onCmdFocusChange?: t.TextInputFocusChangeHandler;
  onKeyDown?: t.TextInputKeyEventHandler;
  onKeyUp?: t.TextInputKeyEventHandler;
  onChildVisibility?: t.SpecListChildVisibilityHandler;
};

export type CmdHostStatefulProps = Omit<CmdHostProps, 'filter'> & {
  mutateUrl?: boolean;
};
