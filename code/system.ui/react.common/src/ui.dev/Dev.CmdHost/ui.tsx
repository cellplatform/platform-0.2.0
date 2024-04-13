import { useEffect, useRef, useState } from 'react';
import { CmdBar, Color, DEFAULTS, Filter, ModuleList, css, type t } from './common';
import { useKeyboard } from './use.Keyboard';

export const View: React.FC<t.CmdHostProps> = (props) => {
  const {
    theme,
    enabled = true,
    pkg = DEFAULTS.pkg,
    applyFilter = DEFAULTS.applyFilter,
    focusOnClick = DEFAULTS.focusOnClick,
  } = props;
  const filteredSpecs = applyFilter ? Filter.imports(props.imports, props.command) : props.imports;

  const readyRef = useRef(false);
  const [textbox, setTextbox] = useState<t.TextInputRef>();
  useKeyboard(textbox, {
    enabled,
    autoGrabFocus: props.autoGrabFocus,
    onArrowKey: () => textbox?.focus(),
    onClear: () => handleFilterChanged(''),
  });

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (textbox && !readyRef.current) {
      readyRef.current = true;
      props.onReady?.({ textbox });
    }
  }, [!!textbox]);

  /**
   * Handlers
   */
  const handleFilterChanged = (command: string) => {
    props.onChanged?.({ command });
  };
  const handleClick = () => {
    if (focusOnClick && textbox) textbox.focus();
  };

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
    <div {...css(styles.base, props.style)} onClick={handleClick}>
      <div {...styles.body}>
        <ModuleList
          title={pkg.name}
          version={pkg.version}
          imports={filteredSpecs}
          badge={props.badge}
          hrDepth={props.hrDepth}
          showParamDev={props.showParamDev}
          focused={props.focused}
          enabled={enabled}
          theme={theme}
          listMinWidth={props.listMinWidth}
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
          enabled={enabled}
          text={props.command}
          placeholder={props.commandPlaceholder}
          hintKey={props.hintKey}
          focusOnReady={props.focusOnReady ?? true}
          onReady={(e) => setTextbox(e.ref)}
          onChange={(e) => handleFilterChanged(e.to)}
          onFocusChange={props.onCmdFocusChange}
          onKeyDown={props.onKeyDown}
          onKeyUp={props.onKeyUp}
        />
      </div>
    </div>
  );
};
