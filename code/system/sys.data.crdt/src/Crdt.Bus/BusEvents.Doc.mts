import { filter, map } from 'rxjs/operators';
import { Automerge, t } from './common.mjs';

type O = Record<string, unknown>;

/**
 * Event API: Single document.
 */
export async function CrdtDocEvents<T extends O>(
  args: t.CrdtDocEventsArgs<T> & { events: t.CrdtEvents },
) {
  const { id, initial, events } = args;

  function wrangleInitial<T extends O>(input: T | (() => T)): T {
    const value = typeof input === 'function' ? input() : input;
    return Automerge.from<T>(value) as T;
  }

  const getCurrent = async () => {
    const exists = (await events.ref.exists.fire(id)).exists;
    const change = exists ? undefined : wrangleInitial(initial);
    return (await events.ref.fire<T>({ id, change })).doc.data as T;
  };
  let _current: T = await getCurrent();

  const changed$ = events.ref.changed$.pipe(
    filter((e) => e.doc.id === args.id),
    map((e) => e as t.CrdtRefChanged<T>),
  );

  changed$.subscribe((e) => {
    _current = e.doc.next;
  });

  const api: t.CrdtDocEvents<T> = {
    id,
    changed$,

    get current() {
      return _current;
    },

    async change(handler) {
      events.ref.fire({ id, change: handler });
      return _current;
    },
  };

  return api;
}
