import { ValueHandler, type t } from '../common';
import { TestRunner } from '../TestRunner';

type O = Record<string, unknown>;
type Margin = t.CssValue['Margin'];

/**
 * A BDD test-selector/runner.
 */
export function bdd<S extends O = O>(
  events: t.DevEvents,
  ctx: t.DevCtx,
  initial: S,
  fn: t.DevBddHandler<S>,
) {
  if (!ctx.is.initial) return;

  const changeHandlers = new Set<t.DevBddChangedHandler<S>>();
  const values = {
    margin: ValueHandler<Margin, S>(events),
    initial: ValueHandler<t.TestPropListData, S>(events),
    enabled: ValueHandler<boolean, S>(events),
  };

  const args: t.DevBddHandlerArgs<S> = {
    ctx,
    initial(input) {
      values.initial.handler(input);
      return args;
    },
    margin(input) {
      values.margin.handler(input);
      return args;
    },
    enabled(input) {
      values.enabled.handler(input);
      return args;
    },
    onChange(handler) {
      if (typeof handler === 'function') changeHandlers.add(handler);
      return args;
    },
    redraw(subject) {
      Object.values(values).forEach((value) => value.redraw());
      if (subject) events.redraw.subject();
    },
  };

  const ref = ctx.debug.row(async (e) => {
    const state = await ctx.state<S>(initial);
    const change = state.change;
    const onChange: t.TestPropListChangeHandler = async (e) => {
      const dev = ctx.toObject().props;
      const changed = e;
      changeHandlers.forEach((fn) => fn({ ...args, dev, state, change, event: changed }));
    };

    const hasHandlers = changeHandlers.size > 0;
    const isEnabled = values.enabled.current !== false;

    return (
      <TestRunner.PropList.Controlled
        initial={values.initial.current}
        margin={values.margin.current}
        enabled={isEnabled}
        onChanged={hasHandlers ? onChange : undefined}
      />
    );
  });

  Object.values(values).forEach((value) => value.subscribe(ref.redraw));
  fn?.(args);
}
