import { distinctUntilChanged } from 'rxjs/operators';

import { Fetch } from '../Fetch.mjs';
import { BusEvents } from './BusEvents.mjs';
import { BusMemoryState } from './BusMemoryState.mjs';
import { DEFAULTS, Filesystem, Pkg, R, rx, t, TestFilesystem, Time } from './common.mjs';
import { Storage } from '../Storage';
import { Paths } from './Paths.mjs';

type UrlString = string;

export type LocalStorageState = { selection: { url: string } };

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
  const localstorage = Storage.Local.object<LocalStorageState>('ui.state', {
    selection: { url: '' },
  });

  const fireChanged = (messages: string[]) => {
    Time.delay(0, () => {
      events.changed.fire(...messages);
    });
  };

  const getLocalFilesystem = async () => {
    if (typeof window?.indexedDB === 'object') {
      const bus = args.instance.bus;
      return (await Filesystem.client({ bus })).fs;
    } else {
      // NB: Running on non-server runtime (probably within tests).
      return TestFilesystem.memory().fs;
    }
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
    const commits: string[] = [];

    /**
     * FETCH: Outline (Markdown)
     */
    if (!error && target.includes('RootIndex')) {
      /**
       * TODO
       *  - Figure out how to not hard-code this path.
       *   by looking it up in some kind of "semi-strongly typed" content-manifest.
       */

      const updateOutlineInState = async (text: string) => {
        const message = 'Fetched outline';
        await state.change(message, (tree) => {
          const markdown = tree.markdown || (tree.markdown = {});
          markdown.outline = text;
        });
        commits.push(message);
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
      const path = Paths.schema.index;

      if (await fs.exists(path)) {
        const data = await fs.read(path);
        const text = data ? new TextDecoder().decode(data) : '';
        await updateOutlineInState(text);
      } else {
        const res = await Fetch.text(path);
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
        const message = 'Fetched log history';
        await state.change(message, (draft) => (draft.log = history));
        commits.push(message);
      }
    }

    const current = state.current;
    bus.fire({
      type: 'app.state/fetch:res',
      payload: { tx, instance, current, error },
    });

    if (commits.length > 0) fireChanged(commits);
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
      const message = 'Selection changed';
      await state.change(message, (draft) => (draft.selected = next));
      fireChanged([message]);

      /**
       * Persist in local-storage
       */
      const data: LocalStorageState = { selection: next ?? { url: '' } };
      localstorage.set(data);
    }
  });

  /**
   * Change (Update)
   */
  events.change.req$.subscribe(async (e) => {
    const { tx, message } = e;
    let error: string | undefined;

    try {
      await state.change(e.message, e.handler);
      fireChanged([message]);

      // HACK 🐷
      const fs = await getLocalFilesystem();
      const data = state.current.markdown?.outline ?? '';
      await fs.write(Paths.schema.index, data);
    } catch (err: any) {
      error = err.message;
    }

    bus.fire({
      type: 'app.state/change:res',
      payload: { tx, instance, current: state.current, message, error },
    });
  });

  /**
   * [LISTEN] Load document upon selection change.
   */
  events.changed.$.pipe(
    distinctUntilChanged((prev, next) => prev.current.selected?.url === next.current.selected?.url),
  ).subscribe(async (e) => {
    const url = e.current.selected?.url;

    const message = 'Load document after selection (url) change';
    await state.change(message, async (draft) => {
      const markdown = draft.markdown ?? (draft.markdown = {});
      const before = markdown.document;
      if (!url) {
        markdown.document = undefined;
      } else {
        const path = Paths.toDataPath(url);
        const { text, error } = await Fetch.text(path);
        markdown.document = error ? undefined : text;
      }
      if (markdown.document !== before) fireChanged([message]);
    });
  });

  /**
   * Initialize
   */
  events.select.fire(localstorage.get()?.selection?.url);

  /**
   * Finish up
   */
  return events;
}
