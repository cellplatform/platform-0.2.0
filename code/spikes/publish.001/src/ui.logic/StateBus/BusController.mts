import { distinctUntilChanged } from 'rxjs/operators';

import { Fetch } from '../Fetch.mjs';
import { FetchFile, Storage } from '../Storage';
import { BusEvents } from './BusEvents.mjs';
import { BusMemoryState } from './BusMemoryState.mjs';
import { slug, Processor, DEFAULTS, Pkg, R, rx, t, Time, Path, BundlePaths } from './common.mjs';
import { Paths } from './Paths.mjs';

type UrlString = string;

/**
 * Event controller.
 */
export function BusController(args: {
  instance: t.Instance;
  filter?: (e: t.StateEvent) => boolean;
  dispose$?: t.Observable<any>;
  initial?: { location?: UrlString };
}): t.StateEvents {
  const { filter, initial = {} } = args;
  const bus = rx.busAsType<t.StateEvent>(args.instance.bus);
  const instance = args.instance.id || DEFAULTS.instance;

  const localstorage = Storage.Local.object<t.LocalStorageState>('ui.state', {
    selection: DEFAULTS.state.selection,
    env: DEFAULTS.state.env,
  });

  const state = BusMemoryState({
    location: initial.location,
    env: localstorage.current.env,
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

  // let _fs: t.Fs | undefined;
  // const getFilesystem = async () => _fs ?? (_fs = await FetchFile.fs({ bus, dispose$ }));

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

      const fetchRemote = async () => {
        const res = await Fetch.text(path);
        if (res.error) error = res.error;
        if (!error) {
          await updateState(res.text);
        }
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
      // const fs = await getFilesystem();
      const path = Paths.schema.index;

      // if (await fs.exists(path)) {
      /**
       * SAVE
       */
      // const data = await fs.read(path);
      // const text = data ? new TextDecoder().decode(data) : '';
      // await updateState(text);
      // } else {
      //   // await fetchRemote();
      // }

      await fetchRemote();
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
    const path = e.selected;

    const getEditorPath = () => {
      return path ? Paths.toDataPath(path) : Paths.schema.index;
    };

    const next: t.StateSelection = {};
    if (path) next.index = { path };

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
      // const fs = await getFilesystem();
      // const markdown = state.current.markdown;
      // const url = state.current.selection.index?.path;
      // const hasSelection = Boolean(url);
      // const data = (hasSelection ? markdown?.document : markdown?.outline) ?? '';
      // if (data) {
      //   const path = hasSelection ? Paths.toDataPath(url ?? '') : Paths.schema.index;
      //   await fs.write(path, data);
      // }
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
   * MONITOR: Save changes to local-storage.
   */
  const localStorageDiff = (p: t.StateChanged, n: t.StateChanged) => {
    const prev = p.current;
    const next = n.current;
    if (prev.selection.index?.path !== next.selection.index?.path) return false;
    if (!R.equals(prev.env, next.env)) return false;
    return true;
  };
  events.changed.$
    //
    .pipe(distinctUntilChanged(localStorageDiff))
    .subscribe(async (e) => {
      const { selection, env } = e.current;
      localstorage.merge({ selection, env });
    });

  /**
   * MONITOR: Load document upon selection change.
   */

  const selectionDiff = (prev: t.StateChanged, next: t.StateChanged) => {
    return prev.current.selection.index?.path === next.current.selection.index?.path;
  };
  events.changed.$
    //
    .pipe(distinctUntilChanged(selectionDiff))
    .subscribe(async (e) => {
      const tx = slug();
      const url = e.current.selection.index?.path;

      const get = (draft: t.StateTree) => draft.markdown ?? (draft.markdown = {});

      if (!url) {
        const commit = 'document load: cleared';
        await state.change(commit, (draft) => {
          get(draft).document = undefined;
          draft.loading.document = undefined;
        });
        fireChanged([commit]);
      }

      if (url) {
        const commit = 'load document (selection): start';
        await state.change(commit, (draft) => (draft.loading.document = tx));
        fireChanged([commit]);

        const path = Paths.toDataPath(url);
        const { text, error } = await Fetch.text(path);

        if (state.current.loading.document === tx) {
          const commit = 'load document (selection): complete';
          await state.change(commit, (draft) => {
            get(draft).document = error ? undefined : text;
            draft.loading.document = undefined;
          });
          fireChanged([commit]);
        }
      }
    });

  /**
   * Overlay: Initiate
   */
  events.overlay.req$.subscribe(async (e) => {
    const { tx, def, context } = e;

    // Initial setup.
    const commit1 = `Initiate showing overlay`;
    await state.change(commit1, (draft) => (draft.overlay = { tx, def }));
    fireChanged([commit1]);

    // Attempt to load content.
    let md: t.ProcessedMdast | undefined;
    let error: string | undefined;

    const rootDir = Path.join(BundlePaths.data.base, BundlePaths.data.md);
    const path = Path.toAbsolutePath(Path.join(rootDir, e.path));
    const fetched = await Fetch.text(path);

    if (fetched.error) error = `Failed while loading overlay. ${fetched.error}`;
    if (!fetched.error) md = await Processor.toMarkdown(fetched.text);

    // Write content into state.
    const commit2 = `Update overlay with loaded content ${error ? '(failed)' : ''}`.trim();
    await state.change(commit2, (draft) => {
      const overlay = draft.overlay || (draft.overlay = { tx, def });
      overlay.content = md ? { md, path: e.path } : undefined;
      overlay.context = context;
      overlay.error = error;
    });
    fireChanged([commit2]);
  });

  /**
   * Overlay: Close.
   */
  events.overlay.close$.subscribe(async (e) => {
    const errors = [...(e.errors ?? [])];
    const current = state.current;

    if (!current.overlay) {
      const error = `Cannot close overlay as one is not present on controller instance '${instance}'.`;
      errors.push(error);
    }

    if (current.overlay) {
      const commit = `Closing overlay`;
      await state.change(commit, (draft) => (draft.overlay = undefined));
      fireChanged([commit]);
    }

    const tx = current.overlay?.tx ?? '';
    bus.fire({
      type: 'app.state/overlay:res',
      payload: { tx, instance, errors },
    });
  });

  /**
   * Initialize
   */
  const init = async () => {
    const local = localstorage.current;
    events.select.fire(local.selection.index?.path);

    /**
     * TODO 🐷
     * - store "ready state" when asyncronously complete.
     * - fire "ready state changed" event.
     */
  };
  init();

  /**
   * Finish up
   */
  return events;
}
