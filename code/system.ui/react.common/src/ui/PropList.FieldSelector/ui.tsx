import { useEffect, useState } from 'react';
import { Button, DEFAULTS, KeyboardMonitor, css, rx, useMouseState, type t } from './common';

import { PropList } from '../PropList/ui/PropList';
import { Label } from './ui.Label';

export const View: React.FC<t.PropListFieldSelectorProps> = (props) => {
  const {
    selected = [],
    resettable = DEFAULTS.resettable,
    indexes = DEFAULTS.indexes,
    indent = DEFAULTS.indent,
  } = props;
  const all = [...(props.all ?? [])];
  const isSelected = (field: string) => selected.includes(field);

  const mouse = useMouseState();
  const [_, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);

  /**
   * Ensure redraw when keyboard changes.
   * Used for "resetable" display option.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    KeyboardMonitor.$.pipe(
      rx.takeUntil(dispose$),
      rx.filter(() => resettable),
    ).subscribe(() => increment());
    return dispose;
  }, []);

  /**
   * [Handlers]
   */
  const handleClick = (field: string) => {
    const previous = [...selected];
    const action = selected.includes(field) ? 'Deselect' : 'Select';
    const next = action === 'Select' ? [...selected, field] : selected.filter((f) => f !== field);
    props.onClick?.(Wrangle.clickArgs({ field, action, previous, next }));
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
    };
    return { label, value };
  });

  if (resettable) {
    const keyboard = KeyboardMonitor.state.current;
    const metaKey = keyboard.modifiers.meta;
    const label = mouse.isOver && metaKey ? DEFAULTS.label.clear : DEFAULTS.label.reset;
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

/**
 * Helpers
 */
type ClickArgs<F extends string = string> = t.PropListFieldSelectorClickHandlerArgs<F>;

const Wrangle = {
  clickArgs(input: Omit<ClickArgs, 'as'>): ClickArgs {
    const payload: ClickArgs = {
      ...input,
      as<T extends string>() {
        return payload as ClickArgs<T>;
      },
    };
    return payload;
  },
};
