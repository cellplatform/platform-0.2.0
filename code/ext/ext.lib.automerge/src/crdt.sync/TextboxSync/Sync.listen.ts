import { Calc } from './Sync.Calc';
import { Doc, ObjectPath, rx, type t } from './common';

type O = Record<string, unknown>;

/**
 * Sync listener.
 */
export function listen<T extends O>(
  textbox: t.TextInputRef,
  doc: t.DocRef<T> | t.Lens<T>,
  path: t.ObjectPath,
  options: { dispose$?: t.UntilObservable; debug?: string } = {},
) {
  const { debug = 'unknown' } = options;
  const resolve = ObjectPath.resolver<string>();

  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;
  const event = {
    textbox: textbox.events(dispose$),
    doc: doc.events(dispose$),
    handlers: { change: new Set<t.TextboxSyncChangeHandler>() },
  } as const;
  dispose$.subscribe(() => event.handlers.change.clear());

  /**
   * Ensure property target exists.
   */
  const initial = resolve(doc.current, path);
  if (typeof initial !== 'string') {
    if (initial !== undefined) throw new Error(`The sync path [${path}] is not of type string.`);
    doc.change((d) => ObjectPath.mutate(d, path, ''));
  }

  /**
   * Changes from the <input> element.
   */
  const input$ = event.textbox.change$.pipe(
    rx.filter((e) => e.to !== resolve(doc.current, path)),
    rx.map((e) => Calc.diff(e.from, e.to, e.selection.start)),
    rx.filter((diff) => diff.index >= 0),
  );

  input$.subscribe((diff) => {
    doc.change((d) => {
      Doc.splice(d, path, diff.index, diff.delCount, diff.newText);
    });
  });

  /**
   * Changes from CRDT document.
   */
  event.doc.changed$
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

    // Lifecycle
    dispose,
    dispose$,
    get disposed() {
      return life.disposed;
    },
  } as const;
  return api;
}
