import { R, rx, t } from './common';
import { Util } from './Util.mjs';

/**
 * Default controller for the TestRunnerPropList component.
 */
export async function TestRunnerPropListController(initial?: t.TestRunnerPropListData) {
  const $ = new rx.Subject<t.TestRunnerPropListChange>();
  const lifecycle = rx.lifecycle();
  const { dispose, dispose$ } = lifecycle;

  /**
   * Setup the current state of the component.
   */
  const _current = await Wrangle.initialState(initial);

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
        ..._current,
        specs: {
          ..._current.specs,

          /**
           * Handle selection <Switch> being toggled.
           */
          async onChange(e) {
            // Update selection state.
            const hash = Util.hash(e.spec);
            let selected = _current.specs?.selected ?? [];

            if (e.to && !selected.includes(hash)) selected = [...selected, hash];
            if (!e.to) selected = selected.filter((item) => item !== hash);
            _current.specs = { ..._current.specs, selected };

            console.log('_current.specs', _current.specs);

            // Bubble event.
            initial?.specs?.onChange?.(e);
            $.next({
              action: 'Specs:Selection',
              data: api.current,
            });
          },
        },
      };
    },

    get selected() {
      return _current.specs?.selected ?? [];
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
