import { useEffect, useState } from 'react';

import { css, DevBase, t } from './common';
import { CmdBar } from './ui.CmdBar';
import { useKeyboard } from './useKeyboard.mjs';

export type CmdHostProps = {
  pkg: { name: string; version: string };
  specs?: t.SpecImports;
  filter?: string;
  selectedIndex?: number;
  hintKey?: string | string[];
  hrDepth?: number;
  badge?: t.SpecListBadge;
  style?: t.CssValue;
  onChanged?: (e: { filter: string }) => void;
  onCmdFocusChange?: t.TextInputFocusChangeHandler;
  onKeyDown?: t.TextInputKeyEventHandler;
  onKeyUp?: t.TextInputKeyEventHandler;
};

export const CmdHost: React.FC<CmdHostProps> = (props) => {
  const { pkg } = props;
  const [textboxRef, setTextboxRef] = useState<t.TextInputRef>();

  useKeyboard(textboxRef);

  /**
   * Handlers
   */
  const filterChanged = (filter: string) => {
    props.onChanged?.({ filter });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
      gridTemplateRows: '1fr auto',
    }),
    body: css({
      position: 'relative',
      display: 'grid',
      Scroll: true,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <DevBase.SpecList
          title={pkg.name}
          version={pkg.version}
          imports={props.specs}
          filter={props.filter}
          badge={props.badge}
          hrDepth={props.hrDepth}
          selectedIndex={props.selectedIndex}
        />
      </div>
      <CmdBar
        text={props.filter}
        hintKey={props.hintKey}
        onReady={(ref) => setTextboxRef(ref)}
        onChanged={(e) => filterChanged(e.to)}
        onFocusChange={props.onCmdFocusChange}
        onKeyDown={props.onKeyDown}
        onKeyUp={props.onKeyUp}
      />
    </div>
  );
};
