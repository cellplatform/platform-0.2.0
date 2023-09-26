import { DocEvents } from './Doc.Events';
import { Is, R, type t } from './common';

export const Doc = {
  /**
   * Check for the existence of the specified document.
   */
  exists(repo: t.Repo, uri?: string) {
    return Is.automergeUrl(uri) ? Boolean(repo.find(uri)) : false;
  },

  /**
   * Find of initialize a new document from the repo.
   */
  findOrCreate<T>(repo: t.Repo, args: t.DocRefArgs<T>) {
    const create = () => {
      const doc = repo.create<T>();
      doc.change((d: any) => args.initial(d));
      return doc;
    };

    const handle = Is.automergeUrl(args.uri) ? repo.find<T>(args.uri) : create();
    const uri = handle.url;

    const api: t.DocRefHandle<T> = {
      uri,
      handle,
      get current() {
        return handle.docSync();
      },
      change(fn) {
        handle.change((d: any) => fn(d));
      },
      events(dispose$) {
        return DocEvents.init<T>(handle, { dispose$ });
      },
      toObject() {
        return R.clone(api.current);
      },
    };
    return api;
  },
} as const;
