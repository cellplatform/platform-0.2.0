import { R, rx, t } from './common';
import { Util } from './Util.mjs';

/**
 * Default controller for the TestRunnerPropList component.
 */
export async function controller(initial?: t.TestRunnerPropListData) {
  const $ = new rx.Subject<t.TestRunnerPropListChange>();
  const lifecycle = rx.lifecycle();
  const { dispose, dispose$ } = lifecycle;

  const fire = (kind: t.TestRunnerPropListChange['op']) => {
    $.next({
      op: kind,
      data: api.current,
      selected: api.selected,
    });
  };

  const State = {
    _current: await Wrangle.initialState(initial),
    get current() {
      return State._current;
    },

    get specs() {
      return State.current.specs ?? (State.current.specs = {});
    },

    selectSpec(hash: string) {
      const selected = State.specs.selected ?? [];
      if (!selected.includes(hash)) {
        State.current.specs = {
          ...State.current.specs,
          selected: [...selected, hash],
        };
      }
    },

    unselectSpec(hash: string) {
      const selected = State.specs.selected ?? [];
      State.specs.selected = selected.filter((item) => item !== hash);
    },
  };

  /**
   * API
   */
  const api = {
    kind: 'TestRunner.PropList.Controller',
    $: $.pipe(rx.takeUntil(dispose$)),

    /**
     * The current state of the component.
     */
    get current(): t.TestRunnerPropListData {
      return {
        ...State.current,
        specs: {
          ...State.current.specs,

          /**
           * Handle selection <Switch> being toggled.
           */
          async onSelect(e) {
            // Update selection state.
            const hash = Util.hash(e.spec);
            if (e.to) State.selectSpec(hash);
            if (!e.to) State.unselectSpec(hash);

            // Bubble event.
            initial?.specs?.onSelect?.(e);
            fire('selection');
          },

          async onRunSingle(e) {
            const hash = Util.hash(e.spec);
            State.selectSpec(hash); // NB: Additive to the selection (when run).


            // Bubble event.
            initial?.specs?.onRunSingle?.(e);
            fire('run:single');
          },

          async onReset(e) {
            // Update selection state.
            const all = await Promise.all((State.current.specs?.all ?? []).map(Util.ensureLoaded));
            const selected = e.modifiers.meta ? [] : all.map((item) => item?.hash!).filter(Boolean);
            State.current.specs = { ...State.current.specs, selected };

            // Bubble event.
            initial?.specs?.onReset?.(e);
            fire('reset');
          },
        },
      };
    },

    /**
     * The list of selected specs (by "spec:hash" URI)
     */
    get selected() {
      return State.current.specs?.selected ?? [];
    },

    /**
     * Lifecycle.
     */
    dispose,
    dispose$,
    get disposed() {
      return lifecycle.disposed;
    },
  } as const;

  return api;
}

/**
 * Helpers
 */
const Wrangle = {
  async initialState(initial?: t.TestRunnerPropListData) {
    const data = R.clone(initial ?? {});
    const specs = data.specs ?? (data.specs = {});
    specs.all = specs.all ?? [];
    specs.selected = specs.selected ?? [];
    return data;
  },
};
