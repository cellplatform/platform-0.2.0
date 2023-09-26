import { Is, type t } from './common';

export const Handle = {
  getOrCreate<T>(repo: t.Repo, args: t.DocRefArgs<T>) {
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
    };
    return api;
  },
} as const;
