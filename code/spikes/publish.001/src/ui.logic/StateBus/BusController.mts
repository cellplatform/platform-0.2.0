import { Fetch } from '../Fetch.mjs';
import { BusEvents } from './BusEvents.mjs';
import { BusMemoryState } from './BusMemoryState.mjs';
import { BundlePaths, DEFAULTS, Path, Pkg, rx, t, Time } from './common.mjs';

const ALL_TARGETS: t.StateFetchTopic[] = ['Outline'];

/**
 * Event controller.
 */
export function BusController(args: {
  instance: t.StateInstance;
  filter?: (e: t.StateEvent) => boolean;
  dispose$?: t.Observable<any>;
}): t.StateEvents {
  const { filter } = args;
  const bus = rx.busAsType<t.StateEvent>(args.instance.bus);
  const instance = args.instance.id || DEFAULTS.instance;
  const state = BusMemoryState();

  const fireChanged = () => Time.delay(0, () => events.changed.fire());

  const events = BusEvents({
    instance: args.instance,
    dispose$: args.dispose$,
    filter,
  });

  /**
   * Info (Module)
   */
  events.info.req$.subscribe(async (e) => {
    const { tx } = e;
    const { name = '', version = '' } = Pkg;

    const info: t.StateInfo = {
      module: { name, version },
      current: state.current,
    };

    bus.fire({
      type: 'app.state/info:res',
      payload: { tx, instance, info },
    });
  });

  /**
   * Fetch Data
   */
  events.fetch.req$.subscribe(async (e) => {
    const { tx, target = ALL_TARGETS } = e;
    let error: undefined | string = undefined;
    let _fireChanged_ = false;

    if (!error && target.includes('Outline')) {
      /**
       * TODO 🐷
       * - Figure out how to not hard-code this path.
       *   by looking it up in some kind of "semi-strongly typed" content-manifest.
       */
      const path = Path.toAbsolutePath(Path.join(BundlePaths.data.md, 'outline.md'));
      const res = await Fetch.markdown(path);

      if (res.error) error = res.error;
      if (!res.error) {
        const { markdown, info } = res;
        state.change((tree) => (tree.outline = { markdown, info }));
        _fireChanged_ = true;
      }
    }

    if (!error && target.includes('Log')) {
      const history = await Fetch.logHistory();
      if (history) {
        state.change((draft) => (draft.log = history));
      }
    }

    const current = state.current;
    bus.fire({
      type: 'app.state/fetch:res',
      payload: { tx, instance, current, error },
    });

    if (_fireChanged_) fireChanged();
  });

  /**
   * Selection Change
   */
  events.select.$.subscribe(async (e) => {
    let _fireChanged = false;

    const selected = e.selected;
    if (selected !== state.current.selected) {
      state.change((draft) => {
        draft.selected = selected;
      });
      _fireChanged = true;
    }

    if (_fireChanged) fireChanged();
  });

  /**
   * API
   */
  return events;
}
