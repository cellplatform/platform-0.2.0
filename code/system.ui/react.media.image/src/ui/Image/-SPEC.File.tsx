import { Crdt, CrdtViews, TestFilesystem, type t } from '../../test.ui';

export type DevDataController = Awaited<ReturnType<typeof DevDataController>>;

const docid = 'dev-image';
type Doc = { name: string; image?: t.ImageBinary | null };
const initial: Doc = { name: 'Untitled' };

/**
 * DEV: controls saving the image to a server.
 */
export async function DevDataController(options: { dispose$?: t.Observable<any> } = {}) {
  const { dispose$ } = options;
  const dir = 'dev/image.sample';
  const fs = (await TestFilesystem.client()).fs.dir(dir);

  const doc = Crdt.ref<Doc>(docid, initial);
  const file = await Crdt.file<Doc>(fs, doc, { dispose$, autosave: true });

  return {
    dir,
    file,
    render: () => renderFileCard(dir, file),
    update: (image: t.ImageBinary) => doc.change((d) => (d.image = image)),
    get current() {
      return doc.current;
    },
  } as const;
}

/**
 * Render <Info> Component.
 */
function renderFileCard(path: string, file: t.CrdtDocFile<Doc>) {
  const doc = file.doc;
  return (
    <CrdtViews.Info
      card={true}
      title={['', 'CRDT']}
      margin={[15, 25, 25, 30]}
      fields={[
        'Module',
        'Module.Verify',
        'History',
        'History.Item',
        'History.Item.Message',
        'File',
        'File.Driver',
      ]}
      data={{
        file: { doc: file, path },
        history: {
          data: doc.history,
          // item: { title: 'Latest Change', data: doc.history[doc.history.length - 1] },
        },
        url: { href: '?dev=sys.data.crdt.tests' },
      }}
    />
  );
}
