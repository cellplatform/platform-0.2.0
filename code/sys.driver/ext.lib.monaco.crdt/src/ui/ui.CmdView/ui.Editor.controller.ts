import { Doc, ObjectPath, rx, Syncer, type t } from './common';

type O = Record<string, unknown>;

/**
 * Code editor controller.
 */
export function editorController(args: {
  monaco: t.Monaco;
  editor: t.MonacoCodeEditor;
  doc: t.Doc;
  identity?: t.IdString;
  readOnly?: boolean;
  dataPath?: t.ObjectPath;
  editorPath?: t.ObjectPath;
  dispose$?: t.UntilObservable;
}) {
  const { monaco, editor, doc, dataPath = [], editorPath = [], identity } = args;

  /**
   * TODO 🐷
   * - editor path
   */

  /**
   * Lifecycle.
   */
  const life = rx.lifecycle(args.dispose$);
  const { dispose$ } = life;
  dispose$.subscribe(() => {});

  type T = {};
  const lens = Doc.lens<O, T>(doc, dataPath, {
    init: (d) => ObjectPath.Mutate.ensure(d, dataPath, {}),
    dispose$,
  });

  /**
   * Editor state.
   */
  Syncer.listen(monaco, editor, lens, { identity, dispose$ });

  // Finish up.
  return life;
}
