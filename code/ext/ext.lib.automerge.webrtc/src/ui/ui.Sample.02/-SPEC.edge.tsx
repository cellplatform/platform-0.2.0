import { Dev, TestDb, Crdt } from '../../test.ui';
import { createEdge } from './-SPEC';
import { type t } from './common';
import { Reload } from './ui.Reload';
import { SampleEdge } from './ui.Sample.Edge';

type T = { reload?: boolean };
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.02.edge';
export default Dev.describe(name, (e) => {
  let left: t.SampleEdge;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    left = await createEdge('Left');

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-y')
      .display('grid')
      .render<T>(async (e) => {
        const width = 250;
        if (e.state.reload) return <Reload style={{ width }} />;
        return <SampleEdge edge={left} style={{ width }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      dev.button([`delete database: "${TestDb.EdgeSample.left.name}"`, '💥'], async (e) => {
        await TestDb.EdgeSample.left.deleteDatabase();
        e.change((d) => (d.reload = true));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const total = (edge: t.SampleEdge) => {
        return edge.repo.index.doc.current.docs.length;
      };

      const format = (edge: t.SampleEdge) => {
        const uri = edge.repo.index.doc.uri;
        return {
          total: total(edge),
          'index:uri': Crdt.Uri.id(uri, { shorten: 6 }),
          index: edge.repo.index.doc.current,
        };
      };

      const data = {
        [`index[${total(left)}]`]: format(left),
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
