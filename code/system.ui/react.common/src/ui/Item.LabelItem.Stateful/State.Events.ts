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
    keyboard: undefined as E['keyboard'] | undefined,
    command: undefined as E['command'] | undefined,
  };

  const api: t.LabelItemStateEvents = {
    $,
    get keyboard() {
      if (!cache.keyboard) {
        const filterOnKey = (code: string) => keydown$.pipe(rx.filter<K>((e) => e.code === code));
        cache.keyboard = {
          $: keydown$,
          enter$: filterOnKey('Enter'),
          escape$: filterOnKey('Escape'),
        };
      }
      return cache.keyboard;
    },
    get command() {
      if (!cache.command) {
        cache.command = {
          $: cmd$,
          clipboard$: rx.payload<t.LabelItemClipboardCommand>(cmd$, 'Item:Clipboard'),
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
