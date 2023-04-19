import { Crdt, t } from './common';

import { NetworkSchema } from '../../sys.net.schema';

export type { DocShared } from '../../sys.net.schema';
export type DocMe = { count: number; text?: string; code?: t.AutomergeText };

export async function SpecDocs(args: { rootfs: t.Fs; dispose$?: t.Observable<any> }) {
  const { dispose$ } = args;

  const getFs = (path: string) => ({ path, fs: args.rootfs.dir(path) });
  const dirs = {
    get: getFs,
    me: getFs('dev.doc.me'),
    shared: getFs('dev.doc.shared'),
  };

  const docMe = Crdt.Doc.ref<DocMe>('me-doc', { count: 0 }, { dispose$ });
  const docShared = NetworkSchema.genesis().doc;

  return {
    dirs,
    me: {
      doc: docMe,
      file: await Crdt.Doc.file<DocMe>(dirs.me.fs, docMe, { autosave: true, dispose$ }),
      path: dirs.me.path,
    },
    shared: {
      doc: docShared,
    },
  };
}
