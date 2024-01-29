import { type t, DEFAULTS, rx } from './common';

/**
 * An adapter for managing 2-way binding between a code-editor UI
 * component and a CRDT (Automerge.Text) data-structure.
 */
export function listen(args: {
  monaco: t.Monaco;
  editor: t.MonacoCodeEditor;
  lens: t.Lens<any>;
  debounce?: t.Msecs;
  dispose$?: t.UntilObservable;
}) {
  const { monaco, editor, lens, debounce = DEFAULTS.debounce } = args;

  const life = rx.lifecycle();
  const { dispose, dispose$ } = life;
  dispose$.subscribe(() => {
    //
  });

  //
  console.log('args', args); // TEMP 🐷
}
