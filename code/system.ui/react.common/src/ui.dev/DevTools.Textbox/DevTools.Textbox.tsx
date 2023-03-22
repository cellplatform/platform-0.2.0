import { t, ValueHandler } from '../common';
import { Textbox } from './ui.Textbox';

type O = Record<string, unknown>;
type BoolOrNil = boolean | undefined | null;
type StringOrNil = string | undefined | null;
type ContentInput = StringOrNil | JSX.Element;

/**
 * A plain-text Textbox input.
 */
export function textbox<S extends O = O>(
  events: t.DevEvents,
  ctx: t.DevCtx,
  initial: S,
  fn: t.DevTextboxHandler<S>,
) {
  if (!ctx.is.initial) return;

  const label = ValueHandler<ContentInput, S>(events);
  const value = ValueHandler<StringOrNil, S>(events);
  const placeholder = ValueHandler<ContentInput, S>(events);
  const right = ValueHandler<ContentInput, S>(events);
  const enabled = ValueHandler<BoolOrNil, S>(events);
  const changeHandlers = new Set<t.DevTextboxChangeHandler<S>>();
  const enterHandlers = new Set<t.DevTextboxEnterHandler<S>>();

  const args: t.DevTextboxHandlerArgs<S> = {
    ctx,
    label(input) {
      label.handler(input);
      return args;
    },
    value(input) {
      value.handler(input);
      return args;
    },
    placeholder(input) {
      placeholder.handler(input);
      return args;
    },
    right(input) {
      right.handler(input);
      return args;
    },
    enabled(input) {
      enabled.handler(input);
      return args;
    },
    onChange(handler) {
      if (typeof handler === 'function') changeHandlers.add(handler);
      return args;
    },
    onEnter(handler) {
      if (typeof handler === 'function') enterHandlers.add(handler);
      return args;
    },
  };

  const ref = ctx.debug.row(async (e) => {
    const state = await ctx.state<S>(initial);
    const change = state.change;
    const onChange: t.TextInputChangeEventHandler = (e) => {
      const next = e.to;
      const dev = ctx.toObject().props;
      changeHandlers.forEach((fn) => fn({ ...args, dev, next, state, change }));
    };
    const onEnter: t.TextInputKeyEventHandler = (e) => {
      const dev = ctx.toObject().props;
      enterHandlers.forEach((fn) => fn({ ...args, dev, state, change }));
    };

    const hasHandlers = changeHandlers.size > 0;
    const isEnabled = hasHandlers && enabled.current !== false;

    return (
      <Textbox
        isEnabled={isEnabled}
        value={value.current}
        label={label.current}
        placeholder={placeholder.current}
        right={right.current}
        onChange={hasHandlers ? onChange : undefined}
        onEnter={onEnter}
      />
    );
  });

  label.subscribe(ref.redraw);
  value.subscribe(ref.redraw);
  placeholder.subscribe(ref.redraw);
  right.subscribe(ref.redraw);
  enabled.subscribe(ref.redraw);

  fn?.(args);
}
