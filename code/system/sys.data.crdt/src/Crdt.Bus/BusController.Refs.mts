import { Automerge, Is, rx, t } from '../common/index.mjs';
import { CrdtFilesystem } from './BusController.fs.mjs';

type O = Record<string, unknown>;
type DocumentId = string;
type Ref = { id: DocumentId; data: O };
type Refs = { [id: DocumentId]: Ref };

/**
 * Maintain memory references to documents.
 */
export function BusControllerRefs(args: { bus: t.EventBus<any>; events: t.CrdtEvents }) {
  const { events } = args;
  const id = events.instance.id;
  const bus = rx.busAsType<t.CrdtEvent>(args.bus);
  const refs: Refs = {};

  /**
   * Request/Response [change].
   */
  events.ref.req$.subscribe(async (e) => {
    const { tx } = e;
    const ref = refs[e.doc.id];
    let error: string | undefined;

    /**
     * TODO 🐷
     * - lookup in file-system if provided.
     * - ad as "load" property to Request event.
     */

    const created = !Boolean(ref) && typeof e.change === 'object';
    let changed = !created && Boolean(e.change);

    let data = ref?.data;
    const prev = data;

    /**
     * Replacement/initial object.
     */
    if (typeof e.change === 'object') {
      data = Is.automergeObject(e.change) ? e.change : Automerge.from(e.change);
    }

    /**
     * Mutation handler.
     */
    if (typeof e.change === 'function') {
      if (!data) {
        error = `Cannot change data with handler. The document has not been initialized.`;
        changed = false;
      } else {
        data = Automerge.change(data, (doc) => {
          if (typeof e.change === 'function') e.change(doc);
        });
      }
    }

    /**
     * Save (persist to filesystem).
     */
    let saved = false;
    if (!error && typeof e.save === 'object') {
      if (!data) {
        error = `Cannot save data. The document has not been initialized.`;
      } else {
        const { fs, path, strategy = 'Doc', json } = e.save;
        const res = await CrdtFilesystem.save(strategy, { fs, path, data, json });
        if (res.error) error = res.error;
        saved = !res.error;
      }
    }

    /**
     * Store reference.
     */
    const exists = Boolean(data);
    const doc = { id: e.doc.id, data };
    if (exists) {
      refs[e.doc.id] = { id: e.doc.id, data };
    }

    /**
     * Finish up.
     */
    bus.fire({
      type: 'sys.crdt/ref:res',
      payload: { tx, id, doc, exists, created, changed, saved, error },
    });

    if (changed) {
      bus.fire({
        type: 'sys.crdt/ref/changed',
        payload: { tx, id, doc: { id: e.doc.id, prev, next: data } },
      });
    }
  });

  /**
   * Remove reference.
   */
  events.ref.remove.remove$.subscribe((e) => {
    const { doc } = e;
    const exists = Boolean(refs[doc.id]);
    delete refs[doc.id];
    if (exists) {
      bus.fire({
        type: 'sys.crdt/ref/removed',
        payload: { id, doc },
      });
    }
  });

  /**
   * Exists.
   */
  events.ref.exists.req$.subscribe((e) => {
    const { tx, doc } = e;
    const exists = Boolean(refs[doc.id]);
    bus.fire({
      type: 'sys.crdt/ref/exists:res',
      payload: { tx, id, doc, exists },
    });
  });
}
