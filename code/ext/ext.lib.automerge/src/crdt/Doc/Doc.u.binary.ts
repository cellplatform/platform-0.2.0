import { DocHandle } from '@automerge/automerge-repo';
import { A, DocUri, Is, type t } from './common';
import { Handle } from './u.Handle';

type O = Record<string, unknown>;
type Uri = t.DocUri | t.UriString;

/**
 * Generate a new document from a stored binary.
 *
 * NOTE: this uses the "hard-coded byte array hack"
 * refs:
 *   - https://automerge.org/docs/cookbook/modeling-data/#setting-up-an-initial-document-structure
 *   - https://discord.com/channels/1200006940210757672/1231799313995403384
 *   - https://discord.com/channels/1200006940210757672/1230453235207110666/1230520148478267402
 *
 * To generate the hard-coded binary:
 *
 *      type D = { count: number };
 *      const doc = A.change(A.init<D>(), (d) => (d.count = 0));
 *      const binary = A.save(doc);
 */
export function fromBinary<T extends O>(args: {
  repo: t.Repo;
  binary: Uint8Array;
  uri?: Uri;
  dispose$?: t.UntilObservable;
}) {
  const { repo, binary, dispose$ } = args;
  const uri = args.uri ?? DocUri.generate.uri();
  const id = DocUri.id(uri) as t.DocumentId;
  if (!Is.automergeUrl(uri)) throw new Error(`Invalid document URI: ${uri}`);

  // Construct handle from binary data.
  const isNew = false;
  const handle = new DocHandle(id, { isNew });
  const doc = tryLoadBinary(binary);
  if (!doc) throw new Error(`Invalid document binary`);
  handle.update(() => A.clone(doc));

  // Register within repo.
  repo.handles[id] = handle;
  repo.emit('document', { handle, isNew });

  // Finish up.
  return Handle.wrap<T>(handle, { dispose$ });
}

/**
 * Convert a document to a [Uint8Array] for storage.
 *
 *    See the "hard-coded byte array hack"
 *    https://automerge.org/docs/cookbook/modeling-data/#setting-up-an-initial-document-structure
 */
export function toBinary<T extends O>(init: t.ImmutableNext<T>): Uint8Array {
  const doc = A.change(A.init<T>(), (d) => init(d));
  return A.save(doc);
}

/**
 * Helpers
 */
function tryLoadBinary(data: Uint8Array) {
  try {
    return A.load(data);
  } catch (error: any) {
    return undefined;
  }
}
