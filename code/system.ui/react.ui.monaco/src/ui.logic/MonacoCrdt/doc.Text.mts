import { t, Crdt } from './common';

/**
 * Helpers for working with the {text} object within a CRDT document.
 */
export function DocText<D extends {}>(args: t.MonacoCrdtSyncerDocTextArg<D>) {
  const api = {
    get $() {
      return args.doc.$;
    },
    get(doc: D) {
      const text = args.getText(doc);
      if (!Crdt.Is.text(text)) throw new Error(`[Automerge.Text] not returned from getter`);
      return text;
    },
    change(fn: (text: t.AutomergeText) => void) {
      args.doc.change((d) => {
        const text = api.get(d);
        if (text) fn(text);
      });
    },
  };

  return api;
}
