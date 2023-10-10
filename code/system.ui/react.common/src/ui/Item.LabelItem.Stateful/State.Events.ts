import { R, rx, type t } from './common';

type K = t.LabelItemKeyHandlerArgs;
type E = t.LabelItemStateEvents;

/**
 * Event wrapper factory.
 */
export function events(
  $: t.Observable<t.PatchChange<t.LabelItem>>,
  dispose$?: t.UntilObservable,
): t.LabelItemStateEvents {
  const lifecycle = rx.lifecycle(dispose$);
  $ = $.pipe(rx.takeUntil(lifecycle.dispose$));

  const cmd$ = $.pipe(
    rx.distinctUntilChanged((prev, next) => R.equals(prev.to.command, next.to.command)),
    rx.filter((e) => Boolean(e.to.command)),
    rx.map((e) => e.to.command!),
  );

  const keydown$ = rx.payload<t.LabelItemKeydownCommand>(cmd$, 'Item:Keydown');

  const cache = {
    keyboard: undefined as E['key'] | undefined,
    command: undefined as E['command'] | undefined,
  };

  const api: t.LabelItemStateEvents = {
    $,
    get key() {
      if (!cache.keyboard) {
        const filterOn = (code: string) => keydown$.pipe(rx.filter<K>((e) => e.code === code));
        cache.keyboard = {
          $: keydown$,
          enter$: filterOn('Enter'),
          escape$: filterOn('Escape'),
        };
      }
      return cache.keyboard;
    },
    get command() {
      if (!cache.command) {
        type C = t.LabelItemClipboard;

        const action$ = rx.payload<t.LabelItemActionInvokedCommand>(cmd$, 'Item:Action');
        const clipboard$ = rx.payload<t.LabelItemClipboardCommand>(cmd$, 'Item:Clipboard');
        const clipboard = (a: C['action']) => clipboard$.pipe(rx.filter((e) => e.action === a));

        cache.command = {
          $: cmd$,
          redraw$: rx
            .payload<t.LabelItemRedrawCommand>(cmd$, 'Item:Redraw')
            .pipe(rx.map((e) => e.tx)),
          clipboard: {
            $: clipboard$,
            cut$: clipboard('Cut'),
            copy$: clipboard('Copy'),
            paste$: clipboard('Paste'),
          },
          action: {
            $: action$,
            filter<K extends t.LabelActionKind>(kind: K) {
              return action$.pipe(
                rx.filter((e) => kind.includes(e.kind)),
                rx.map((e) => e as t.LabelItemActionInvoked<K>),
              );
            },
          },
        };
      }
      return cache.command;
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
