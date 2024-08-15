import { useEffect } from 'react';
import { Doc, Monaco, ObjectPath, rx, type t } from './common';

type O = Record<string, unknown>;

/**
 * Listens to changes within the editor/doc combo.
 */
export function useChangeMonitor(args: {
  doc?: t.Doc;
  editor?: t.MonacoCodeEditor;
  dataPath?: t.ObjectPath;
  onChange?: t.CmdViewChangeHandler;
  onDataReady?: t.CmdViewDataHandler;
}) {
  const { doc, editor, dataPath, onChange, onDataReady } = args;

  /**
   * Effect: Data ready.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    if (doc && dataPath && onDataReady) {
      const payload = wrangle.dataReady(doc, dataPath, dispose$);
      onDataReady(payload);
    }
    return dispose;
  }, [doc?.uri, dataPath?.join()]);

  /**
   * Effect: Granular document changes.
   */
  useEffect(() => {
    const events = doc?.events();
    if (events && doc && editor && onChange) {
      events.changed$.subscribe((change) => {
        const content = Monaco.Editor.Wrangle.Editor.content(editor);
        onChange({ change, content });
      });
    }
    return events?.dispose;
  }, [doc?.uri, editor?.getId()]);
}

/**
 * Helpers
 */
const wrangle = {
  lens(doc: t.Doc, path: t.ObjectPath, dispose$?: t.UntilObservable) {
    doc.change((d) => ObjectPath.Mutate.ensure(d, path, {}));
    return Doc.lens<O, t.EditorContent>(doc, path, { dispose$ });
  },

  dataReady(
    doc: t.Doc,
    path: t.ObjectPath,
    dispose$: t.Observable<void>,
  ): t.CmdViewDataHandlerArgs {
    let _lens: undefined | t.Lens<t.EditorContent>;
    return {
      path,
      doc,
      dispose$,
      get lens() {
        return _lens || (_lens = wrangle.lens(doc, path, dispose$));
      },
    };
  },
} as const;
