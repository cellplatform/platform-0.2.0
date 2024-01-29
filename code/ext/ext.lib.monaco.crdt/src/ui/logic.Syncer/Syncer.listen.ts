import { type t, DEFAULTS, rx } from './common';

type O = Record<string, unknown>;

/**
 * An adapter for managing 2-way binding between a code-editor UI
 * component and a CRDT (Automerge.Text) data-structure.
 */
export function listen<T extends O>(args: {
  lens: t.Lens<T>;
  // monaco: t.Monaco;
  // editor: t.MonacoCodeEditor;
  // debounce?: t.Msecs;
  // dispose$?: t.UntilObservable;
}) {
  //   const { monaco, editor, debounce = DEFAULTS.debounce } = args;
  //
  //   const life = rx.lifecycle();
  //   const { dispose, dispose$ } = life;
  //   dispose$.subscribe(() => {
  //     //
  //   });

  //
  console.log('args', args); // TEMP 🐷
}
