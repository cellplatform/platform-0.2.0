import { R, rx, type t } from './common';

export function events(
  $: t.Observable<t.PatchChange<t.LabelItem>>,
  dispose$?: t.UntilObservable,
): t.LabelItemStateEvents {
  const lifecycle = rx.lifecycle(dispose$);
  $ = $.pipe(rx.takeUntil(lifecycle.dispose$));

  const command$ = $.pipe(
    rx.distinctUntilChanged((prev, next) => R.equals(prev.to.cmd, next.to.cmd)),
    rx.filter((e) => Boolean(e.to.cmd)),
    rx.map((e) => e.to.cmd!),
  );

  const keydown$ = rx.payload<t.LabelItemKeydownCommand>(command$, 'Item:Keydown');
  const meta$ = keydown$.pipe(rx.filter((e) => e.is.meta));

  type K = t.LabelItemKeyHandlerArgs;
  const filterOnKey = (code: string) => rx.filter<K>((e) => e.code === code);
  const filterOnMetaKey = (code: string) => meta$.pipe(filterOnKey(code));

  const api: t.LabelItemStateEvents = {
    $,
    cmd$: command$,
    keydown$,
    keyboard: {
      copy$: filterOnMetaKey('KeyC'),
      paste$: filterOnMetaKey('KeyV'),
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
