import { t, DEFAULTS, Automerge } from './common';
import { DocRef } from './DocRef.mjs';
import { DocIs } from './DocIs.mjs';

type Milliseconds = number;

/**
 * TODO 🐷
 * - autosave (or not)
 * - log saving strategy
 */

export async function DocFile<D extends {}>(
  filedir: t.Fs,
  initial: D | t.CrdtDocRef<D>,
  options: { autosaveAfter?: Milliseconds } = {},
) {
  const filename = DEFAULTS.doc.filename;
  const doc = DocIs.ref(initial) ? initial : DocRef<D>(initial);

  const api: t.CrdtDocFile<D> = {
    doc,

    /**
     * Determine if the document currently exists within the file-system.
     */
    exists() {
      return filedir.exists(filename);
    },

    /**
     * Load (and replace) the document from the file-system.
     */
    async load() {
      if (!(await api.exists())) return;
      const data = await filedir.read(filename);
      if (data) api.doc.replace(Automerge.load<D>(data));
    },

    /**
     * Save the document to the file-system.
     */
    async save() {
      const data = Automerge.save(doc.current);
      await filedir.write(filename, data);
    },
  };

  await api.load();
  return api;
}
