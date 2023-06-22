import { useState } from 'react';

import { css, SpecList, t } from './common';
import { CmdBar } from './ui.CmdBar';
import { useKeyboard } from './useKeyboard.mjs';

export type CmdHostProps = {
  pkg: { name: string; version: string };
  specs?: t.SpecImports;
  command?: string;
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

export const CmdHost: React.FC<CmdHostProps> = (props) => {
  const { pkg } = props;
  const [textboxRef, setTextboxRef] = useState<t.TextInputRef>();

  useKeyboard(textboxRef, {
    onArrowKey: () => textboxRef?.focus(),
  });

  /**
   * Handlers
   */
  const filterChanged = (command: string) => {
    props.onChanged?.({ command });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid', gridTemplateRows: '1fr auto' }),
    body: css({
      userSelect: 'none',
      position: 'relative',
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <SpecList
          title={pkg.name}
          version={pkg.version}
          imports={props.specs}
          filter={props.command}
          badge={props.badge}
          hrDepth={props.hrDepth}
          scroll={true}
          scrollTo$={props.scrollTo$}
          selectedIndex={props.selectedIndex}
          onChildVisibility={props.onChildVisibility}
        />
      </div>
      <CmdBar
        text={props.command}
        hintKey={props.hintKey}
        focusOnReady={props.focusOnReady ?? true}
        onReady={(ref) => setTextboxRef(ref)}
        onChanged={(e) => filterChanged(e.to)}
        onFocusChange={props.onCmdFocusChange}
        onKeyDown={props.onKeyDown}
        onKeyUp={props.onKeyUp}
      />
    </div>
  );
};
