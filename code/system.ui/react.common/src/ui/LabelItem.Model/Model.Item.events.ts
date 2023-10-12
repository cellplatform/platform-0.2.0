import { R, rx, type t } from './common';

type O = Record<string, unknown>;

/**
 * Event wrapper factory.
 */
export function events<A extends t.LabelItemActionKind = string, D extends O = O>(
  $: t.Observable<t.PatchChange<t.LabelItem<A, D>>>,
  dispose$?: t.UntilObservable,
): t.LabelItemStateEvents<A, D> {
  const lifecycle = rx.lifecycle(dispose$);
  $ = $.pipe(rx.takeUntil(lifecycle.dispose$));

  const cmd$ = $.pipe(
    rx.distinctUntilChanged((prev, next) => R.equals(prev.to.cmd, next.to.cmd)),
    rx.filter((e) => Boolean(e.to.cmd)),
    rx.map((e) => e.to.cmd!),
  );

  const keydown$ = rx.payload<t.LabelItemKeydownCmd>(cmd$, 'Item:Keydown');

  type K = t.LabelItemKeyHandlerArgs;
  type E = t.LabelItemStateEvents<A, D>;
  const cache = {
    key: undefined as E['key'] | undefined,
    cmd: undefined as E['cmd'] | undefined,
  };
  const api: E = {
    $,
    get key() {
      if (!cache.key) {
        const filterOn = (code: string) => keydown$.pipe(rx.filter<K>((e) => e.code === code));
        cache.key = {
          $: keydown$,
          enter$: filterOn('Enter'),
          escape$: filterOn('Escape'),
        };
      }
      return cache.key;
    },
    get cmd() {
      if (!cache.cmd) {
        type C = t.LabelItemClipboard;

        const mapVoid = rx.map(() => undefined);
        const action$ = rx.payload<t.LabelItemActionInvokedCmd>(cmd$, 'Item:Action');
        const clipboard$ = rx.payload<t.LabelItemClipboardCmd>(cmd$, 'Item:Clipboard');
        const clipboard = (a: C['action']) => clipboard$.pipe(rx.filter((e) => e.action === a));

        cache.cmd = {
          $: cmd$,
          redraw$: rx.payload<t.LabelItemRedrawCmd>(cmd$, 'Item:Redraw').pipe(mapVoid),
          click$: rx.payload<t.LabelItemClickCmd>(cmd$, 'Item:Click'),
          changed$: rx.payload<t.LabelItemChangedCmd>(cmd$, 'Item:Changed'),
          clipboard: {
            $: clipboard$,
            cut$: clipboard('Cut'),
            copy$: clipboard('Copy'),
            paste$: clipboard('Paste'),
          },
          action: {
            $: action$,
            on<K extends t.LabelItemActionKind>(kind: K) {
              return action$.pipe(
                rx.filter((e) => kind.includes(e.kind)),
                rx.map((e) => e as t.LabelItemActionInvoked<K>),
              );
            },
          },
        };
      }
      return cache.cmd;
    },

    /**
     * Lifecycle
     */
    dispose: lifecycle.dispose,
    dispose$: lifecycle.dispose$,
    get disposed() {
      return lifecycle.disposed;
    },
  } as const;
  return api;
}
