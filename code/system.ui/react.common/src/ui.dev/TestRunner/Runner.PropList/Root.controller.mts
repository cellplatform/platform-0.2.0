import { R, rx, t } from './common';
import { Util } from './Util.mjs';

/**
 * Default controller for the TestRunnerPropList component.
 */
export async function controller(initial?: t.TestRunnerPropListData) {
  const $ = new rx.Subject<t.TestRunnerPropListChange>();
  const lifecycle = rx.lifecycle();
  const { dispose, dispose$ } = lifecycle;
  const _current = await Wrangle.initialState(initial);

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

            // Bubble event.
            initial?.specs?.onChange?.(e);
            fire('selection');
          },

          async onReset(e) {
            // Update selection state.
            const all = await Promise.all((_current.specs?.all ?? []).map(Util.ensureLoaded));
            const selected = e.modifiers.meta ? [] : all.map((item) => item?.hash!).filter(Boolean);
            _current.specs = { ..._current.specs, selected };

            // Bubble event.
            initial?.specs?.onReset?.(e);
            fire('reset');
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
