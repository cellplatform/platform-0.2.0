import { Dev, Crdt, Automerge } from '../../test.ui';
import { CrdtHistory, CrdtHistoryProps } from '.';

type T = { redraw: number; props: CrdtHistoryProps };
const initial: T = { redraw: 0, props: {} };

type Doc = { count: number };

export default Dev.describe('CrdtHistory', (e) => {
  const initialDoc: Doc = { count: 0 };
  const doc = Crdt.Doc.ref<Doc>(initialDoc);

  e.it('init:crdt', async (e) => {
    const ctx = Dev.ctx(e);
    const dispose$ = ctx.dispose$;
    const state = await ctx.state<T>(initial);

    const redraw = () => state.change((d) => d.redraw++);
    doc.$.subscribe(redraw);
    redraw();
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

    dev.section('Change CRDT document', (dev) => {
      dev.button('increment', (e) => doc.change((d) => d.count++));
      dev.button('decrement', (e) => doc.change((d) => d.count--));
    });

    dev.hr(-1, 5);

    /**
     * Footer
     */
    dev.footer.border(-0.1).render<T>((e) => {
      const history = Automerge.getHistory(doc.current);

      const data = {
        'Doc<T>': doc.current,
        history,
      };

      return (
        <Dev.Object
          name={'dev.CrdtHistory'}
          data={data}
          expand={{
            //
            paths: ['$', '$.Doc<T>', '$.history'],
          }}
        />
      );
    });
  });
});
