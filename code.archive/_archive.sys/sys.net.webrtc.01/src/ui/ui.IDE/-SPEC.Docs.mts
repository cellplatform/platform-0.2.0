import { Crdt, type t, WebRtc } from './common';

export type { DocShared } from '../../sys.net.schema';
export type DocMe = { count: number; text?: string; code?: t.AutomergeText };

export async function SpecDocs(args: { rootfs: t.Fs; dispose$?: t.Observable<any> }) {
  const { rootfs, dispose$ } = args;
  const fs = (path: string) => ({ path, fs: rootfs.dir(path) });
  const dirs = {
    get: fs,
    me: fs('dev.doc.me'),
    shared: fs('dev.doc.shared'),
  };

  const docMe = Crdt.Doc.ref<DocMe>('me-doc', { count: 0 }, { dispose$ });
  const docShared = WebRtc.NetworkSchema.genesis().doc;

  return {
    me: {
      doc: docMe,
      file: await Crdt.Doc.file<DocMe>(dirs.me.fs, docMe, { autosave: true, dispose$ }),
      path: dirs.me.path,
      fs: dirs.me.fs,
    },
    shared: {
      doc: docShared,
      // file: await Crdt.Doc.file<DocMe>(dirs.shared.fs, docShared, { autosave: false, dispose$ }),
      path: dirs.shared.path,
      fs: dirs.shared.fs,
    },
  };
}
