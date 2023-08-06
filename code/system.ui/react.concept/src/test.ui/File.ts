import { Crdt, TestFilesystem, type t } from './common';

export type TDoc = {
  slugs: t.SlugListItem[];
};

export const TestFile = {
  async init(options: { dispose$?: t.Observable<any> } = {}) {
    const { dispose$ } = options;
    const dir = 'dev/concept/slugs';
    const fs = (await TestFilesystem.client()).fs.dir(dir);
    const docid = 'dev-index';
    const doc = Crdt.ref<TDoc>(docid, { slugs: [] });
    const file = await Crdt.file<TDoc>(fs.dir('head'), doc, { autosave: true, dispose$ });
    return { dir, fs, doc, file } as const;
  },
} as const;
