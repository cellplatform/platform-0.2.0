import { distinctUntilChanged } from 'rxjs/operators';

import { Fetch } from '../Fetch.mjs';
import { FetchFile, Storage } from '../Storage';
import { BusEvents } from './BusEvents.mjs';
import { BusMemoryState } from './BusMemoryState.mjs';
import { DEFAULTS, Pkg, R, rx, t, Time } from './common.mjs';
import { Paths } from './Paths.mjs';

type UrlString = string;

export type LocalStorageState = { selection: t.StateSelection };

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
    selection: DEFAULTS.state.selection,
  });

  const events = BusEvents({
    instance: args.instance,
    dispose$: args.dispose$,
    filter,
  });
  const { dispose$ } = events;

  const fireChanged = (messages: string[]) => {
    Time.delay(0, () => {
      events.changed.fire(...messages);
    });
  };

  let _fs: t.Fs | undefined;
  const getFilesystem = async () => _fs ?? (_fs = await FetchFile.fs({ bus, dispose$ }));

  /**
   * Info (Module)
   */
  events.info.req$.subscribe(async (e) => {
    const { tx } = e;
    const { name = '', version = '' } = Pkg;
    const current = state.current;

    const info: t.StateInfo = {
      module: { name, version },
      current,
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
    const { tx, topic = [] } = e;

    let error: string | undefined;
    const commits: string[] = [];

    /**
     * FETCH: Outline (Markdown)
     */
    if (!error && topic.includes('RootIndex')) {
      /**
       * TODO
       *  - Figure out how to not hard-code this path.
       *   by looking it up in some kind of "semi-strongly typed" content-manifest.
       */

      const updateState = async (text: string) => {
        const commit = 'Fetched outline';
        await state.change(commit, (tree) => {
          const markdown = tree.markdown || (tree.markdown = {});
          markdown.outline = text;
        });
        commits.push(commit);
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
       *
       */
      const fs = await getFilesystem();
      const path = Paths.schema.index;

      if (await fs.exists(path)) {
        const data = await fs.read(path);
        const text = data ? new TextDecoder().decode(data) : '';
        await updateState(text);
      } else {
        const res = await Fetch.text(path);
        if (res.error) error = res.error;
        if (!error) {
          await updateState(res.text);
        }
      }
    }

    /**
     * FETCH: Log (JSON)
     */
    if (!error && topic.includes('Log')) {
      const history = await Fetch.logHistory();
      if (history) {
        const commit = 'Fetched log history';
        await state.change(commit, (draft) => (draft.log = history));
        commits.push(commit);
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
    const next = url ? { index: { url } } : undefined;

    if (!R.equals(next, state.current.selection)) {
      /**
       * Update local state.
       */
      const commit = 'Selection changed';
      await state.change(commit, (draft) => {
        const selection = next ? next : DEFAULTS.state.selection;
        draft.selection = selection;
      });
      fireChanged([commit]);

      /**
       * Persist in local-storage.
       */
      const data: LocalStorageState = { selection: next ?? DEFAULTS.state.selection };
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

      /**
       * HACK 🐷
       * Temporary filesystem store
       */
      const fs = await getFilesystem();

      const markdown = state.current.markdown;
      const url = state.current.selection.index?.url;
      const hasSelection = Boolean(url);
      const data = (hasSelection ? markdown?.document : markdown?.outline) ?? '';
      if (data) {
        const path = hasSelection ? Paths.toDataPath(url ?? '') : Paths.schema.index;
        await fs.write(path, data);
      }
    } catch (err: any) {
      error = err.message;
    }

    const current = state.current;
    bus.fire({
      type: 'app.state/change:res',
      payload: { tx, instance, current, message, error },
    });
  });

  /**
   * [LISTEN] Load document upon selection change.
   */
  events.changed.$.pipe(
    distinctUntilChanged(
      (prev, next) => prev.current.selection.index?.url === next.current.selection.index?.url,
    ),
  ).subscribe(async (e) => {
    const url = e.current.selection.index?.url;

    const commit = 'Load document after URL selection change';
    await state.change(commit, async (draft) => {
      const markdown = draft.markdown ?? (draft.markdown = {});
      const before = markdown.document;
      if (!url) {
        markdown.document = undefined;
      } else {
        const path = Paths.toDataPath(url);
        const { text, error } = await Fetch.text(path);
        markdown.document = error ? undefined : text;
      }
      if (markdown.document !== before) fireChanged([commit]);
    });
  });

  /**
   * Initialize
   */
  events.select.fire(localstorage.get()?.selection.index?.url);

  /**
   * Finish up
   */
  return events;
}
