import { t, ValueHandler } from '../common';
import { Textbox } from './ui.Textbox';

type O = Record<string, unknown>;
type BoolOrNil = boolean | undefined | null;
type StringOrNil = string | undefined | null;
type ContentInput = StringOrNil | JSX.Element;
type ErrorInput = t.DevTextboxError | boolean | undefined | null;

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

  const enabled = ValueHandler<BoolOrNil, S>(events);
  const label = ValueHandler<ContentInput, S>(events);
  const value = ValueHandler<StringOrNil, S>(events);
  const placeholder = ValueHandler<ContentInput, S>(events);
  const right = ValueHandler<ContentInput, S>(events);
  const footer = ValueHandler<ContentInput, S>(events);
  const error = ValueHandler<ErrorInput, S>(events);

  const changeHandlers = new Set<t.DevTextboxChangeHandler<S>>();
  const enterHandlers = new Set<t.DevTextboxEnterHandler<S>>();

  const args: t.DevTextboxHandlerArgs<S> = {
    ctx,
    enabled(input) {
      enabled.handler(input);
      return args;
    },
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
    footer(input) {
      footer.handler(input);
      return args;
    },
    error(input) {
      error.handler(input);
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
        footer={footer.current}
        error={error.current}
        onChange={hasHandlers ? onChange : undefined}
        onEnter={onEnter}
      />
    );
  });

  enabled.subscribe(ref.redraw);
  label.subscribe(ref.redraw);
  value.subscribe(ref.redraw);
  placeholder.subscribe(ref.redraw);
  right.subscribe(ref.redraw);
  footer.subscribe(ref.redraw);
  error.subscribe(ref.redraw);

  fn?.(args);
}
