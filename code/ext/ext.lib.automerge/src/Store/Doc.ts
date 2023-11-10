import { DocEvents } from './Doc.Events';
import { Is, R, slug, type t } from './common';

type Uri = t.DocUri | string;

export type DocRefArgs<T> = {
  initial: t.ImmutableNext<T>;
  uri?: Uri;
  dispose$?: t.UntilObservable;
};

export const Doc = {
  /**
   * Find the document document from the repo.
   */
  find<T>(repo: t.Repo, uri: Uri, dispose$?: t.UntilObservable) {
    const handle = Is.automergeUrl(uri) ? repo.find<T>(uri) : undefined;
    return handle ? wrapHandle<T>({ handle, dispose$ }) : undefined;
  },

  /**
   * Find or initialize a new document from the repo.
   */
  findOrCreate<T>(repo: t.Repo, args: DocRefArgs<T>) {
    const create = () => {
      const doc = repo.create<T>();
      doc.change((d: any) => args.initial(d));
      return doc;
    };
    const { dispose$ } = args;
    const handle = Is.automergeUrl(args.uri) ? repo.find<T>(args.uri) : create();
    return wrapHandle<T>({ handle, dispose$ });
  },
} as const;

/**
 * Helpers
 */

function wrapHandle<T>(args: { handle: t.DocHandle<T>; dispose$?: t.UntilObservable }) {
  const { handle } = args;
  const api: t.DocRefHandle<T> = {
    instance: slug(),
    uri: handle.url,
    handle,
    get current() {
      return handle.docSync();
    },
    change(fn) {
      handle.change((d: any) => fn(d));
    },
    events(dispose$) {
      return DocEvents.init<T>(handle, { dispose$: [args.dispose$, dispose$] });
    },
    toObject() {
      return R.clone(api.current);
    },
  };
  return api;
}
