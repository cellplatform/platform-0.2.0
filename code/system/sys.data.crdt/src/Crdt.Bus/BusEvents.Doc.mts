import { filter, map } from 'rxjs/operators';
import { Automerge, t, Delete } from './common.mjs';

type O = Record<string, unknown>;

/**
 * Event API: Single document.
 */
export async function CrdtDocEvents<T extends O>(
  args: (t.CrdtDocEventsArgsInit<T> | t.CrdtDocEventsArgsLoad) & { events: t.CrdtEvents },
) {
  const { id, events } = args;

  function wrangleInitial<T extends O>(input: T | (() => T)): T {
    const value = typeof input === 'function' ? input() : input;
    return Automerge.from<T>(value) as T;
  }

  const getCurrentDoc = async () => {
    const exists = (await events.ref.exists.fire(id)).exists;
    const payload: t.CrdtEventsRefArgs<T> = { id };

    if (!exists) {
      const initial = (args as t.CrdtDocEventsArgsInit<T>).initial;
      const load = (args as t.CrdtDocEventsArgsLoad).load;

      if (initial) {
        payload.change = wrangleInitial((args as any).initial);
      }

      if (load) {
        payload.load = load;
      }
    }

    return (await events.ref.fire<T>(payload)).doc;
  };

  const getCurrent = async () => {
    const doc = await getCurrentDoc();
    return doc.data as T;
  };
  let _current: T = await getCurrent();

  const changed$ = events.ref.changed$.pipe(
    filter((e) => e.doc.id === args.id),
    map((e) => e as t.CrdtRefChanged<T>),
  );

  changed$.subscribe((e) => (_current = e.doc.next));

  const api: t.CrdtDocEvents<T> = {
    id,
    changed$,

    /**
     * Retrieve the current state of the data.
     */
    get current() {
      return _current;
    },

    /**
     * Immutable update to the data-structure.
     */
    async change(handler) {
      const change = handler;
      events.ref.fire({ id, change });
      return _current;
    },

    /**
     * Persist the data-structure to a filesystem.
     */
    async save(fs, path, options = {}) {
      const { strategy, json } = options;
      const res = await events.ref.fire({ id, save: { fs, path, strategy, json } });
      const { error } = res;
      return Delete.undefined({ path, error });
    },
  };

  return api;
}
