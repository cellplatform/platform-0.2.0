import { rx, type t } from './common';

/**
 * Factory for an events API of the <TextInput>.
 */
export function eventsFactory(
  source$: t.Observable<t.TextInputEvent>,
  options: { dispose$?: t.UntilObservable } = {},
): t.TextInputEvents {
  const life = rx.lifecycle(options.dispose$);
  const { dispose, dispose$ } = life;

  const $ = source$.pipe(rx.takeUntil(dispose$));

  const api: t.TextInputEvents = {
    $,
    change$: rx.payload<t.TextInputChangeEvent>($, 'sys.TextInput:Change'),
    focus$: rx.payload<t.TextInputFocusEvent>($, 'sys.TextInput:Focus'),
    key$: rx.payload<t.TextInputKeyEvent>($, 'sys.TextInput:Key'),

    dispose,
    dispose$,
    get disposed() {
      return api.disposed;
    },
  };
  return api;
}
