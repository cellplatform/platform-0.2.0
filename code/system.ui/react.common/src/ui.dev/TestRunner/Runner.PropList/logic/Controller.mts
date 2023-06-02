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
    const data = { ...api.current };
    const results = Object.values(data.specs?.results ?? []);
    $.next({
      op,
      data,
      selected: api.selected.hashes,
      get results() {
        return results
          .filter((result) => typeof result === 'object')
          .filter(Boolean) as t.TestSuiteRunResponse[];
      },
    });
  };

  /**
   * Handle selection <Switch> being toggled.
   */
  const onSelect: t.SpecsSelectionHandler = async (e) => {
    initial?.specs?.onSelect?.(e); // Bubble event.

    // Update selection state.
    const hash = e.spec.hash();
    if (e.to) state.selectSpec(hash);
    if (!e.to) state.unselectSpec(hash);

    // Bubble event.
    fire('selection');
  };

  /**
   * Handle "run" button being clicked.
   */
  const onRunSingle: t.SpecRunClickHandler = async (e) => {
    initial?.run?.onRunSingle?.(e); // Bubble event.

    const hash = e.spec.hash();
    state.selectSpec(hash); // NB: Additive to the selection (when run).

    // Pre-run state update.
    state.runStart(e.spec);
    fire('run:single:start');

    // Execute the spec.
    const ctx = Wrangle.ctx(state.specs);
    const res = await e.spec.run({ ctx });
    state.runComplete(e.spec, res);

    // Complete.
    fire('run:single:complete');
  };

  /**
   * Handle the "run all" button being clicked.
   */
  const onRunAll: t.SpecRunAllClickHandler = async (e) => {
    initial?.run?.onRunAll?.(e); // Bubble event.
    fire('run:all:start');

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

    fire('run:all:complete');
  };

  /**
   * Handle "reset" button being clicked.
   */
  const onReset: t.SpecsSelectionResetHandler = async (e) => {
    initial?.specs?.onReset?.(e); // Bubble event.

    // Update selection state.
    const { select = 'all' } = e;
    const all = await api.all();
    const selected = select === 'none' ? [] : all.map((spec) => spec.hash());

    state.current.specs = {
      ...state.current.specs,
      selected,
      results: undefined,
    };

    // Bubble event.
    fire('reset');
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
