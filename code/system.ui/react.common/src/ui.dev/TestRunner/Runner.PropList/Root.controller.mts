import { State } from './Root.controller.State.mjs';
import { Util } from './Util.mjs';
import { Test, rx, t } from './common';

/**
 * Default controller for the TestRunnerPropList component.
 */
export async function controller(initial?: t.TestRunnerPropListData) {
  const lifecycle = rx.lifecycle();
  const { dispose, dispose$ } = lifecycle;

  const $ = new rx.Subject<t.TestRunnerPropListChange>();
  const state = await State(initial);

  const fire = (kind: t.TestRunnerPropListChange['op']) => {
    $.next({
      op: kind,
      data: api.current,
      selected: api.selected.hashes,
    });
  };

  /**
   * Handle selection <Switch> being toggled.
   */
  const onSelect: t.SpecsSelectionHandler = async (e) => {
    // Update selection state.
    const hash = e.spec.hash();
    if (e.to) state.selectSpec(hash);
    if (!e.to) state.unselectSpec(hash);

    // Bubble event.
    initial?.specs?.onSelect?.(e);
    fire('selection');
  };

  /**
   * Handle "run" button being clicked.
   */
  const onRunSpec: t.SpecRunClickHandler = async (e) => {
    const hash = e.spec.hash();
    state.selectSpec(hash); // NB: Additive to the selection (when run).

    // Pre-run state update.
    state.runStart(e.spec);
    fire('run:single:start');

    // Execute the spec.
    const ctx = Wrangle.ctx(state.specs);
    const res = await e.spec.run({ ctx });
    state.runComplete(e.spec, res);

    // Bubble event.
    initial?.specs?.onRunSpec?.(e);
    fire('run:single:complete');
  };

  /**
   * Handle "reset" button being clicked.
   */
  const onReset: t.SpecsSelectionResetHandler = async (e) => {
    // Update selection state.
    const all = await api.all();
    const selected = e.modifiers.meta ? [] : all.map((spec) => spec.hash());
    state.current.specs = { ...state.current.specs, selected };

    // Bubble event.
    initial?.specs?.onReset?.(e);
    fire('reset');
  };

  /**
   * Create a bundle of the currently selected specs.
   */
  const bundle: t.GetTestSuite = async () => {
    const specs = await api.selected.specs();
    const ctx = Wrangle.ctx(state.current.specs!);
    const root = await Test.bundle(specs);
    return { root, ctx };
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
          onSelect,
          onRunSpec,
          onReset,
        },
      };
    },

    /**
     * The list of selected specs (by "spec:hash" URI).
     */
    get selected() {
      const hashes = state.current.specs?.selected ?? [];
      return {
        hashes,
        bundle,
        async specs() {
          return (await api.all()).filter((spec) => hashes.includes(spec.hash()));
        },
      };
    },

    /**
     * Retrieves the complete list of initialized specs.
     */
    async all() {
      const wait = (state.current.specs?.all ?? []).map(Util.ensureLoaded);
      return (await Promise.all(wait)).filter(Boolean).map((item) => item?.suite!);
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
