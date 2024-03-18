import { useEffect, useState } from 'react';
import { Button, css, DEFAULTS, KeyboardMonitor, rx, useMouse, type t } from './common';

import { View as PropList } from '../PropList/ui';
import { Label } from './ui.Label';
import { Wrangle } from './Wrangle';

export const View: React.FC<t.PropListFieldSelectorProps> = (props) => {
  const {
    resettable = DEFAULTS.resettable,
    indexes = DEFAULTS.indexes,
    indent = DEFAULTS.indent,
  } = props;
  const selected = Wrangle.fields(props.selected);
  const all = Wrangle.fields([...(props.all ?? [])]);
  const isSelected = (field: string) => selected.includes(field);

  const mouse = useMouse();
  const [, setCount] = useState(0);
  const redraw = () => setCount((prev) => prev + 1);

  /**
   * Ensure redraw when keyboard changes.
   * Used for "resetable" display option.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    KeyboardMonitor.$.pipe(
      rx.takeUntil(dispose$),
      rx.filter(() => resettable),
    ).subscribe(() => redraw());
    return dispose;
  }, []);

  /**
   * [Handlers]
   */
  const handleClick = (field: string) => {
    const modifiers = KeyboardMonitor.state.current.modifiers;
    const previous = [...selected];
    const { action, next } = Wrangle.next(all, selected, field, modifiers);
    const args = Wrangle.clickArgs({ field, action, previous, next });
    props.onClick?.(args);
  };

  const handleReset = (e: React.MouseEvent) => {
    const action = e.metaKey ? 'Reset:Clear' : 'Reset:Default';
    const next = e.metaKey ? [] : props.defaults; // NB: force empty if meta-key, otherwise use defaults.
    props.onClick?.(
      Wrangle.clickArgs({
        action,
        previous: [...selected],
        next,
      }),
    );
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  const items: t.PropListItem[] = all.map((field) => {
    const onClick = () => handleClick(field);
    const label = (
      <Label
        field={field}
        all={all}
        selected={selected}
        indexes={indexes}
        indent={indent}
        onClick={onClick}
      />
    );
    const value: t.PropListValueSwitch = {
      kind: 'Switch',
      data: isSelected(field),
      indent,
      onClick,
      color: props.switchColor ?? DEFAULTS.switchColor,
    };
    return { label, value };
  });

  if (resettable) {
    const keyboard = KeyboardMonitor.state.current;
    const metaKey = keyboard.modifiers.meta;
    const label = mouse.is.over && metaKey ? DEFAULTS.label.clear : DEFAULTS.label.reset;
    const el = <Button onClick={handleReset}>{label}</Button>;
    items.push({ label: ``, value: { data: el } });
  }

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <PropList
        //
        title={props.title}
        items={items}
        defaults={{ clipboard: false }}
      />
    </div>
  );
};
