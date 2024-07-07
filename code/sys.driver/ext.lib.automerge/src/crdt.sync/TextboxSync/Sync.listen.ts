import { Doc, ObjectPath, rx, type t } from './common';

type O = Record<string, unknown>;

/**
 * Sync listener.
 */
export function listen<T extends O>(
  textbox: t.TextInputRef,
  state: t.Doc<T> | t.Lens<T>,
  path: t.ObjectPath,
  options: { dispose$?: t.UntilObservable; debug?: string } = {},
) {
  const { debug = 'Unknown' } = options;
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;
  const event = {
    textbox: textbox.events(dispose$),
    state: state.events(dispose$),
    handlers: { change: new Set<t.TextboxSyncChangeHandler>() },
  } as const;
  dispose$.subscribe(() => event.handlers.change.clear());

  /**
   * Ensure property target exists.
   */
  const resolve = ObjectPath.resolver<string>();
  const initial = resolve(state.current, path);
  if (typeof initial !== 'string') {
    if (initial !== undefined) throw new Error(`The sync path [${path}] is not of type string.`);
    state.change((d) => ObjectPath.mutate(d, path, ''));
  }

  /**
   * Changes from the <input> element → CRDT
   */
  const input$ = event.textbox.change$.pipe(
    rx.filter((e) => e.to !== resolve(state.current, path)),
    rx.map((e) => Doc.Text.diff(e.from, e.to, e.selection.start)),
    rx.filter((diff) => diff.index >= 0),
  );
  input$.subscribe((diff) => {
    state.change((d) => Doc.Text.splice(d, path, diff.index, diff.delCount, diff.newText));
  });

  /**
   * Changes from CRDT → <input>
   */
  event.state.changed$
    .pipe(rx.filter((e) => resolve(e.after, path) !== textbox.current.value))
    .subscribe((e) => {
      const text = resolve(e.after, path) ?? '';
      const pos = textbox.current.selection.start;
      event.handlers.change.forEach((fn) => fn({ text, pos }));
    });

  /**
   * API
   */
  const api: t.TextboxSyncListener = {
    onChange(fn) {
      event.handlers.change.add(fn);
      return api;
    },

    // Lifecycle.
    dispose,
    dispose$,
    get disposed() {
      return life.disposed;
    },
  } as const;
  return api;
}
