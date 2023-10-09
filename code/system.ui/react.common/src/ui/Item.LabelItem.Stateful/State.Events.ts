import { R, rx, type t } from './common';

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
  const meta$ = keydown$.pipe(rx.filter((e) => e.is.meta));

  type K = t.LabelItemKeyHandlerArgs;
  const filterOnKey = (code: string) => rx.filter<K>((e) => e.code === code);
  const filterOnMetaKey = (code: string) => meta$.pipe(filterOnKey(code));

  const api: t.LabelItemStateEvents = {
    $,
    keyboard: {
      $: keydown$,
      enter$: filterOnMetaKey('Enter'),
      escape$: filterOnMetaKey('Escape'),
    },
    command: {
      $: cmd$,
      clipboard$: rx.payload<t.LabelItemClipboardCommand>(cmd$, 'Item:Clipboard'),
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
