import { R, rx, t } from './common';
import { Util } from './Util.mjs';
import { State } from './Root.controller.State.mjs';

/**
 * Default controller for the TestRunnerPropList component.
 */
export async function controller(initial?: t.TestRunnerPropListData) {
  const $ = new rx.Subject<t.TestRunnerPropListChange>();
  const lifecycle = rx.lifecycle();
  const { dispose, dispose$ } = lifecycle;

  const state = await State(initial);

  const fire = (kind: t.TestRunnerPropListChange['op']) => {
    $.next({
      op: kind,
      data: api.current,
      selected: api.selected,
    });
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
        ...state.current,
        specs: {
          ...state.current.specs,

          /**
           * Handle selection <Switch> being toggled.
           */
          async onSelect(e) {
            // Update selection state.
            const hash = e.spec.hash();
            if (e.to) state.selectSpec(hash);
            if (!e.to) state.unselectSpec(hash);

            // Bubble event.
            initial?.specs?.onSelect?.(e);
            fire('selection');
          },

          async onRunSingle(e) {
            const hash = e.spec.hash();
            state.selectSpec(hash); // NB: Additive to the selection (when run).



            // Bubble event.
            initial?.specs?.onRunSingle?.(e);
            fire('run:single');
          },

          async onReset(e) {
            // Update selection state.
            const all = await Promise.all((state.current.specs?.all ?? []).map(Util.ensureLoaded));
            const selected = e.modifiers.meta
              ? []
              : all.map((item) => item?.suite.hash()!).filter(Boolean);
            state.current.specs = { ...state.current.specs, selected };

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
      return state.current.specs?.selected ?? [];
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
  ctx(specs: t.TestRunnerPropListSpecsData) {
    const ctx = specs.ctx ?? {};
    return typeof ctx === 'function' ? ctx() : ctx;
  },
};
