import { DocEvents } from './Doc.Events';
import { Is, type t } from './common';

export const Doc = {
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
    };
    return api;
  },
} as const;
