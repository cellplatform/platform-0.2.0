import { useState } from 'react';
import { CommandBar, Filter, SpecList, css, type t } from './common';

import { useKeyboard } from './useKeyboard.mjs';

export const View: React.FC<t.CmdHostProps> = (props) => {
  const { pkg, applyFilter = true } = props;
  const filteredSpecs = applyFilter ? Filter.specs(props.specs, props.command) : props.specs;

  const [textboxRef, setTextboxRef] = useState<t.TextInputRef>();
  useKeyboard(textboxRef, {
    onArrowKey: () => textboxRef?.focus(),
    onClear: () => filterChanged(''),
  });

  /**
   * Handlers
   */
  const filterChanged = (command: string) => props.onChanged?.({ command });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid', gridTemplateRows: '1fr auto' }),
    body: css({ userSelect: 'none', position: 'relative', display: 'grid' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <SpecList
          title={pkg.name}
          version={pkg.version}
          imports={filteredSpecs}
          badge={props.badge}
          hrDepth={props.hrDepth}
          showParamDev={props.showParamDev}
          focused={props.focused}
          scroll={true}
          scrollTo$={props.scrollTo$}
          selectedIndex={props.selectedIndex}
          onItemVisibility={props.onItemVisibility}
          onItemClick={props.onItemClick}
          onItemSelect={props.onItemSelect}
        />
      </div>
      <CommandBar
        text={props.command}
        placeholder={props.commandPlaceholder}
        hintKey={props.hintKey}
        focusOnReady={props.focusOnReady ?? true}
        onReady={(ref) => setTextboxRef(ref)}
        onChange={(e) => filterChanged(e.to)}
        onFocusChange={props.onCmdFocusChange}
        onKeyDown={props.onKeyDown}
        onKeyUp={props.onKeyUp}
      />
    </div>
  );
};
