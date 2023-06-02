import { Util } from '../Util.mjs';
import { rx, t } from '../common';
import { State } from './Controller.State.mjs';

/**
 * Default controller for the TestRunnerPropList component.
 */
export async function PropListController(initial?: t.TestRunnerPropListData) {
  const lifecycle = rx.lifecycle();
  const { dispose, dispose$ } = lifecycle;

  const $ = new rx.Subject<t.TestRunnerPropListChange>();
  const state = await State(initial);

  const fire = (op: t.TestRunnerPropListChange['op']) => {
    $.next({
      op,
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
    fire('selection');
    initial?.specs?.onSelect?.(e);
  };

  /**
   * Handle "run" button being clicked.
   */
  const onRunSingle: t.SpecRunClickHandler = async (e) => {
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
    fire('run:single:complete');
    initial?.run?.onRunSingle?.(e);
  };

  /**
   * Handle the "run all" button being clicked.
   */
  const onRunAll: t.SpecRunAllClickHandler = async (e) => {
    const { modifiers } = e;
    const forceAll = modifiers.meta;

    state.clearResults();

    if (forceAll) {
      (await api.all()).forEach((spec) => state.selectSpec(spec.hash()));
    }

    const specs = forceAll ? await api.all() : await api.selected.specs();
    for (const spec of specs) {
      await onRunSingle({ spec, modifiers });
    }

    // Bubble event.
    initial?.run?.onRunAll?.(e);
  };

  /**
   * Handle "reset" button being clicked.
   */
  const onReset: t.SpecsSelectionResetHandler = async (e) => {
    const { select = 'all' } = e;

    // Update selection state.
    const all = await api.all();
    // const selected = e.modifiers.meta ? [] : all.map((spec) => spec.hash());
    const selected = select === 'none' ? [] : all.map((spec) => spec.hash());

    state.current.specs = {
      ...state.current.specs,
      selected,
      results: undefined,
    };

    // Bubble event.
    fire('reset');
    initial?.specs?.onReset?.(e);
  };

  /**
   * Create a bundle of the currently selected specs.
   */
  const bundle: t.GetTestBundle = async () => {
    const specs = await api.selected.specs();
    const ctx = Wrangle.ctx(state.current.specs!);
    return { specs, ctx };
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
        run: {
          ...state.current.run,
          bundle,
          onRunSingle,
          onRunAll,
        },
        specs: {
          ...state.current.specs,
          onSelect,
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
