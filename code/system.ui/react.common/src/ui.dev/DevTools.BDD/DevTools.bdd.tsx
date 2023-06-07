import { TestRunner } from '../TestRunner';
import { LocalStorage, ValueHandler, type t } from '../common';

type O = Record<string, unknown>;
type Margin = t.CssValue['Margin'];
type ListInput = t.TestPropListRunData['list'];
type LocalStore = { selected: string[] };

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
    list: ValueHandler<{ input: ListInput }, S>(events),
    run: ValueHandler<t.DevBddRunDef, S>(events),
    enabled: ValueHandler<boolean, S>(events),
    margin: ValueHandler<Margin, S>(events),
  };

  let local: LocalStore | undefined;
  const createLocal = (key: string) => {
    const store = LocalStorage<LocalStore>(`${key}:bdd`);
    local = store.object({ selected: [] });
  };

  const args: t.DevBddHandlerArgs<S> = {
    ctx,
    localstore(input) {
      input = (input || '').trim();
      if (input) createLocal(input);
      return args;
    },
    list(input) {
      values.list.handler({ input });
      return args;
    },
    run(input) {
      values.run.handler(input);
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
    onChanged(handler) {
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
      changeHandlers.forEach((fn) => fn({ ...args, dev, state, change, ...e }));
    };

    const isEnabled = values.enabled.current !== false;
    const list = values.list.current?.input;

    const run = values.run.current;
    const data: t.TestPropListData = {
      run: {
        list,
        ctx: run?.ctx,
        infoUrl: run?.infoUrl,
        label: run?.label,
      },
      specs: { selected: local?.selected },
    };

    return (
      <TestRunner.PropList.Controlled
        initial={data}
        margin={values.margin.current}
        enabled={isEnabled}
        onChanged={(e) => {
          if (local) local.selected = e.selected;
          onChange(e);
        }}
      />
    );
  });

  Object.values(values).forEach((value) => value.subscribe(ref.redraw));
  fn?.(args);
}
