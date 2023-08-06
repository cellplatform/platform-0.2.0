import { Dev, type t, Crdt, TestFilesystem, CrdtViews } from '../../test.ui';
import { Root } from '.';

type T = { props: t.IndexProps };
const initial: T = { props: {} };
const name = Root.displayName ?? '';

type Doc = { count: number };

export default Dev.describe(name, async (e) => {
  const dir = 'dev/concept/index.spec';
  const fs = (await TestFilesystem.client()).fs.dir(dir);

  const docid = 'dev-index';
  const doc = Crdt.ref<Doc>(docid, { count: 0 });
  const file = await Crdt.file<Doc>(fs, doc, { autosave: true });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .size('fill-y')
      .display('grid')
      .render<T>((e) => {
        const width = 200;
        return <Root {...e.state.props} style={{ width }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('File', (dev) => {
      dev.button('increment (+)', () => file.doc.change((d) => d.count++));
      dev.button('delete file', () => file.delete());

      dev.hr(0, 6);

      dev.row((e) => {
        return (
          <CrdtViews.Info
            card={true}
            title={'CRDT'}
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
    });

    dev.hr(0, 10);

    dev.TODO();
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
