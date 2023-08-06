import { slug, Crdt, CrdtViews, File } from '../../test.ui';
import type { t, T, TDoc } from './-SPEC.t';

export async function DevFile(
  dev: t.DevTools<T>,
  fs: t.Fs,
  file: t.CrdtDocFile<TDoc>,
  dir: string,
) {
  const state = await dev.state();
  const doc = file.doc;

  dev.title('File');

  dev.button((btn) => {
    btn
      .label(`delete file`)
      .right('⚠️')
      // .enabled(false)
      .onClick((e) => {
        file.delete();
        state.change((d) => (d.props.items = undefined));
      });
  });

  dev.hr(0, 6);

  dev.row((e) => {
    return (
      <CrdtViews.Info
        card={true}
        fields={[
          'Module',
          'History',
          'History.Item',
          'History.Item.Message',
          'File',
          'File.Driver',
        ]}
        data={{
          file: { doc: file, path: dir },
          history: { data: doc.history },
        }}
      />
    );
  });

  dev.hr(0, 6);

  const getJson = () => JSON.stringify(file.doc.current, null, '  ') + '\n';

  dev.button('copy (json)', () => {
    navigator.clipboard.writeText(getJson());
  });

  dev.button(['download (json)', '↓'], () => {
    const bytes = new TextEncoder().encode(getJson());
    const blob = new Blob([bytes], { type: 'application/json' });
    File.download('foo.json', blob, { mimetype: 'application/json' });
  });

  dev.hr(-1, 5);

  dev.button('backup (file)', async () => {
    const dir = 'backup';
    const files = (await fs.dir(dir).manifest()).files;
    const prefix = String(files.length).padStart(3, '0');
    const filename = `${dir}/${prefix}.${Date.now()}.${slug()}`;
    await Crdt.save(fs, filename, doc);
  });
}
