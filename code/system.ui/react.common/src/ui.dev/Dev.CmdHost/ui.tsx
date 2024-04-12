import { useEffect, useRef, useState } from 'react';
import { CmdBar, Color, DEFAULTS, Filter, SpecList, css, type t } from './common';
import { useKeyboard } from './use.Keyboard';

export const View: React.FC<t.CmdHostProps> = (props) => {
  const { pkg, applyFilter = DEFAULTS.applyFilter, theme } = props;
  const filteredSpecs = applyFilter ? Filter.specs(props.specs, props.command) : props.specs;

  const readyRef = useRef(false);
  const [textboxRef, setTextboxRef] = useState<t.TextInputRef>();
  useKeyboard(textboxRef, {
    autoGrabFocus: props.autoGrabFocus,
    onArrowKey: () => textboxRef?.focus(),
    onClear: () => filterChanged(''),
  });

  /**
   * Lifecycle
   */
  useEffect(() => {
    const input = textboxRef;
    if (input && !readyRef.current) {
      readyRef.current = true;
      props.onReady?.({ input });
    }
  }, [!!textboxRef]);

  /**
   * Handlers
   */
  const filterChanged = (command: string) => props.onChanged?.({ command });

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({ position: 'relative', display: 'grid', gridTemplateRows: '1fr auto', color }),
    body: css({ userSelect: 'none', position: 'relative', display: 'grid' }),
    bar: css({
      display: 'grid',
      borderTop: theme === 'Dark' ? `solid 1px ${Color.format(0.15)}` : undefined,
    }),
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
          theme={theme}
          scroll={true}
          scrollTo$={props.scrollTo$}
          selectedIndex={props.selectedIndex}
          onItemVisibility={props.onItemVisibility}
          onItemClick={props.onItemClick}
          onItemSelect={props.onItemSelect}
        />
      </div>
      <div {...styles.bar}>
        <CmdBar
          text={props.command}
          placeholder={props.commandPlaceholder}
          hintKey={props.hintKey}
          focusOnReady={props.focusOnReady ?? true}
          onReady={(e) => setTextboxRef(e.ref)}
          onChange={(e) => filterChanged(e.to)}
          onFocusChange={props.onCmdFocusChange}
          onKeyDown={props.onKeyDown}
          onKeyUp={props.onKeyUp}
        />
      </div>
    </div>
  );
};
