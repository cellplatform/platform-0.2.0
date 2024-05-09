import { Dev, Crdt, Automerge } from '../../test.ui';
import { CrdtHistory, CrdtHistoryProps } from '.';
import { CrdtInfo } from '../Crdt.Info';

type T = { redraw: number; props: CrdtHistoryProps };
const initial: T = { redraw: 0, props: {} };

export default Dev.describe('CrdtHistory', (e) => {
  type Doc = { count: number };
  const initialDoc: Doc = { count: 0 };
  const doc = Crdt.Doc.ref<Doc>('my-id', initialDoc);

  e.it('init:crdt', async (e) => {
    const ctx = Dev.ctx(e);
    doc.$.subscribe(() => ctx.redraw());
    ctx.redraw();
  });

  e.it('init:ui', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <CrdtHistory {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.TODO();

    dev.section('Change CRDT document', (dev) => {
      let message = '';
      dev.textbox((txt) =>
        txt
          .placeholder('commit message')
          .value((e) => message)
          .margin([0, 0, 10, 0])
          .onChange((e) => {
            message = e.to.value;
            e.redraw();
          }),
      );

      const change = (by: number) => doc.change(message, (d) => (d.count += by));
      dev.button('increment', (e) => change(1));
      dev.button('decrement', (e) => change(-1));
    });

    dev.hr(5, 20);

    dev.row((e) => {
      const latest = doc.history[doc.history.length - 1];
      return (
        <CrdtInfo
          fields={['Module', 'History.Item']}
          data={{ history: { item: { data: latest, title: 'Latest Change' } } }}
          margin={[0, 30]}
        />
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const history = Automerge.getHistory(doc.current);
      const latest = history[history.length - 1];
      const data = {
        'Doc<T>': doc.current,
        'history.latest': latest,
        history,
      };

      return (
        <Dev.Object
          name={'dev.CrdtHistory'}
          data={data}
          expand={{
            paths: ['$', '$.Doc<T>'],
          }}
        />
      );
    });
  });
});
