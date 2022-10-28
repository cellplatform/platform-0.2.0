import { BusEvents } from './BusEvents.mjs';
import { Pkg, Path, rx, t, DEFAULTS, BundlePaths, Time } from './common.mjs';
import { Fetch } from '../Fetch.mjs';

const TARGETS: t.StateFetchTarget[] = ['Outline'];

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

  let _current: t.StateTree = {};
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
      current: { ..._current },
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
    const { tx, target = TARGETS } = e;
    let error: undefined | string = undefined;
    let _fireChanged = false;

    if (!error && target.includes('Outline')) {
      /**
       * TODO 🐷
       * - Figure out how to not hard-code this path.
       */
      const path = Path.toAbsolutePath(Path.join(BundlePaths.data.md, 'outline.md'));
      const res = await Fetch.markdown(path);

      if (res.error) error = res.error;
      if (!res.error) {
        const { markdown, info } = res;
        _current = { ..._current, outline: { markdown, info } };
        _fireChanged = true;
      }
    }

    const current = { ..._current };
    bus.fire({
      type: 'app.state/fetch:res',
      payload: { tx, instance, current, error },
    });

    if (_fireChanged) fireChanged();
  });

  /**
   * Selection Change.
   */
  events.select.$.subscribe(async (e) => {
    let _fireChanged = false;

    const selected = e.selected;
    if (selected !== e.selected) {
      _current = { ..._current, selected: selected };
      _fireChanged = true;
    }

    if (_fireChanged) fireChanged();
  });

  /**
   * API
   */
  return events;
}
