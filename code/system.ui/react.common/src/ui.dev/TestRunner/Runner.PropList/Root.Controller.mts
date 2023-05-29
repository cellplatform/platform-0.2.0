import { t, rx, R } from './common';

/**
 * Default controller for the TestRunnerPropList component.
 */
export function TestRunnerPropListController(initial?: t.TestRunnerPropListData) {
  const $ = new rx.Subject<t.TestRunnerPropListChange>();
  const lifecycle = rx.lifecycle();
  const { dispose, dispose$ } = lifecycle;

  /**
   * Setup the current state of the component.
   */
  const _current = Wrangle.initialState(initial);

  /**
   * API
   */
  const api = {
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
          onChange(e) {
            // Update state.
            let selected = _current.specs?.selected ?? [];
            if (e.to && !selected.includes(e.import)) selected = [...selected, e.import];
            if (!e.to) selected = selected.filter((item) => item !== e.import);
            _current.specs = { ..._current.specs, selected };

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
  initialState(initial?: t.TestRunnerPropListData) {
    const data = R.clone(initial ?? {});
    const specs = data.specs ?? (data.specs = {});
    specs.all = specs.all ?? [];
    specs.selected = specs.selected ? specs.selected : specs.all;
    return data;
  },
};
