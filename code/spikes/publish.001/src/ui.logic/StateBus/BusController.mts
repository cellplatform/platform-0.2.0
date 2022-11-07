import { distinctUntilChanged } from 'rxjs/operators';

import { Fetch } from '../Fetch.mjs';
import { BusEvents } from './BusEvents.mjs';
import { BusMemoryState } from './BusMemoryState.mjs';
import { DEFAULTS, Filesystem, Pkg, R, rx, t, TestFilesystem, Time } from './common.mjs';
import { Paths } from './Paths.mjs';

type UrlString = string;

export type LocalFsTransientUiState = { selection: { url: string } };

/**
 * Event controller.
 */
export function BusController(args: {
  instance: t.StateInstance;
  filter?: (e: t.StateEvent) => boolean;
  dispose$?: t.Observable<any>;
  initial?: { location?: UrlString };
}): t.StateEvents {
  const { filter, initial = {} } = args;
  const bus = rx.busAsType<t.StateEvent>(args.instance.bus);
  const instance = args.instance.id || DEFAULTS.instance;
  const state = BusMemoryState({ location: initial.location });

  const fireChanged = () => Time.delay(0, () => events.changed.fire());

  const getLocalFilesystem = async () => {
    if (typeof window?.indexedDB === 'object') {
      const bus = args.instance.bus;
      const store = await Filesystem.client({ bus });
      return store.fs;
    } else {
      // NB: Running on non-server runtime (probably within tests).
      return TestFilesystem.memory().fs;
    }
  };

  const DEFAULT = {
    Selection: { selection: { url: '' } },
  };

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
       * TODO
       *  - Figure out how to not hard-code this path.
       *   by looking it up in some kind of "semi-strongly typed" content-manifest.
       */
      const path = Paths.outline;

      const updateOutlineInState = async (text: string) => {
        await state.change((tree) => {
          const markdown = tree.markdown || (tree.markdown = {});
          markdown.outline = text;
        });
        _fireChanged_ = true;
      };

      /**
       * TEMP HACK:DESIGN placeholder locic 🐷
       * Future Refactor:
       *    Notes:
       *      - Reads to the local filesystem (IndexedDb).
       *      - If not in local file-system FETCH from the corresponding "data.md" file in the remote data store.
       *      - The write (local fs update) is below in the "changed" handler.
       * TODO:
       *  - reset local store (fs) to read remote (concept perhaps: "sync:remote:pull" <=> "sync:remote:push")
       *  - fs: fetch/pull from URL.
       */
      const fs = await getLocalFilesystem();

      if (await fs.exists(path)) {
        const data = await fs.read(path);
        const text = data ? new TextDecoder().decode(data) : '';
        await updateOutlineInState(text);
      } else {
        const res = await Fetch.textAndProcessor(path);
        if (res.error) error = res.error;
        if (!error) {
          await updateOutlineInState(res.text);
        }
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
      /**
       * Update local state.
       */
      await state.change((draft) => (draft.selected = next));
      fireChanged();

      /**
       * Persiste in local file-system.
       */
      const fs = await getLocalFilesystem();
      const data: LocalFsTransientUiState = { selection: next ?? { url: '' } };
      fs.json.write(Paths.Ui.selection, data);
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

      // HACK 🐷
      const fs = await getLocalFilesystem();
      const data = state.current.markdown?.outline ?? '';
      await fs.write(Paths.outline, data);
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
        const path = Paths.toDataPath(selectedRef);
        const { text, error } = await Fetch.textAndProcessor(path);
        markdown.document = error ? undefined : text;
      }
      if (markdown.document !== before) fireChanged();
    });
  });

  /**
   * Initialize
   */
  const init = async () => {
    /**
     * TODO (Refactor)
     * - write an "Init:Ready" event, and force the UI to
     *    1. Hide before "ready"
     *    2. Redraws with new state
     *
     */

    const fs = await getLocalFilesystem();
    const selectionData: LocalFsTransientUiState =
      (await fs.json.read(Paths.Ui.selection)) ?? DEFAULT.Selection;

    const data = { ...selectionData };

    console.group('🌳 UI/Controller: init (local filesystem)');
    console.log('data:', data);
    console.log('data.selection.url', data.selection.url);
    console.groupEnd();

    events.select.fire(data.selection.url || undefined);
  };

  init();

  /**
   * API
   */
  return events;
}
