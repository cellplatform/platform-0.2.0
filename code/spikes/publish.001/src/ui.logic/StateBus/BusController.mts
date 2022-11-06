import { distinctUntilChanged } from 'rxjs/operators';

import { Fetch } from '../Fetch.mjs';
import { BusEvents } from './BusEvents.mjs';
import { BusMemoryState } from './BusMemoryState.mjs';
import { BundlePaths, DEFAULTS, Path, Pkg, R, rx, t, Time } from './common.mjs';

export type UrlString = string;

/**
 * Event controller.
 */
export function BusController(args: {
  instance: t.StateInstance;
  filter?: (e: t.StateEvent) => boolean;
  dispose$?: t.Observable<any>;
  initial?: {
    location?: UrlString;
  };
}): t.StateEvents {
  const { filter, initial = {} } = args;
  const bus = rx.busAsType<t.StateEvent>(args.instance.bus);
  const instance = args.instance.id || DEFAULTS.instance;
  const state = BusMemoryState({ location: initial.location });

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
    const { tx, target = [] } = e;

    let error: string | undefined;
    let _fireChanged_ = false;

    /**
     * FETCH: Outline (Markdown)
     */
    if (!error && target.includes('Outline')) {
      /**
       * TODO 🐷
       * - Figure out how to not hard-code this path.
       *   by looking it up in some kind of "semi-strongly typed" content-manifest.
       */
      const path = toDataPath('outline.md');
      const res = await Fetch.textAndProcessor(path);

      if (res.error) error = res.error;
      if (!res.error) {
        await state.change((tree) => {
          const markdown = tree.markdown || (tree.markdown = {});
          markdown.outline = res.text;
        });
        _fireChanged_ = true;
      }
    }

    /**
     * FETCH: Log (JSON)
     */
    if (!error && target.includes('Log')) {
      const history = await Fetch.logHistory();
      if (history) {
        await state.change((draft) => (draft.log = history));
        _fireChanged_ = true;
      }
    }

    bus.fire({
      type: 'app.state/fetch:res',
      payload: { tx, instance, current: state.current, error },
    });

    if (_fireChanged_) fireChanged();
  });

  /**
   * Selection Change
   */
  events.select.$.subscribe(async (e) => {
    const url = e.selected;
    const next = url ? { url } : undefined;
    if (!R.equals(next, state.current.selected)) {
      await state.change((draft) => (draft.selected = next));
      fireChanged();
    }
  });

  /**
   * Change (Update)
   */
  events.change.req$.subscribe(async (e) => {
    const { tx } = e;
    let error: string | undefined;

    try {
      await state.change(e.handler);
      fireChanged();
    } catch (err: any) {
      error = err.message;
    }

    bus.fire({
      type: 'app.state/change:res',
      payload: { tx, instance, current: state.current, error },
    });
  });

  /**
   * [LISTEN] Load document upon selection change.
   */
  events.changed.$.pipe(
    distinctUntilChanged((prev, next) => prev.current.selected?.url === next.current.selected?.url),
  ).subscribe(async (e) => {
    const selectedRef = e.current.selected?.url;
    await state.change(async (draft) => {
      const markdown = draft.markdown ?? (draft.markdown = {});
      const before = markdown.document;
      if (!selectedRef) {
        markdown.document = undefined;
      } else {
        const path = toDataPath(selectedRef);
        const { text, error } = await Fetch.textAndProcessor(path);
        markdown.document = error ? undefined : text;
      }
      if (markdown.document !== before) fireChanged();
    });
  });

  /**
   * API
   */
  return events;
}

/**
 * Helpers
 */

function toDataPath(input: string) {
  const path = Path.join(BundlePaths.data.md, input);
  return Path.toAbsolutePath(path);
}
