import type { SampleEdge } from '../ui.Sample.02/t';

import { PeerRepoList } from '.';
import { Crdt, Dev, TestDb, type t } from '../../test.ui';
import { createEdge } from '../ui.Sample.02';

type T = { props: t.PeerRepoListProps; debug: { reload?: boolean } };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = PeerRepoList.displayName ?? '';
export default Dev.describe(name, (e) => {
  let left: SampleEdge;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    left = await createEdge('Left');

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});
    const resetReloadClose = () => state.change((d) => (d.debug.reload = false));

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-y')
      .display('grid')
      .render<T>((e) => {
        const width = 250;
        if (e.state.debug.reload) {
          return <TestDb.UI.Reload style={{ width }} onClose={resetReloadClose} />;
        } else {
          return <PeerRepoList {...e.state.props} style={{ width }} />;
        }
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      const deleteButton = (label: string, fn: () => Promise<any>) => {
        dev.button([`delete db: ${label}`, '💥'], async (e) => {
          await e.change((d) => (d.debug.reload = true));
          await fn();
        });
      };
      deleteButton(TestDb.EdgeSample.left.name, TestDb.EdgeSample.left.deleteDatabase);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const total = (edge: SampleEdge) => {
        return edge.repo.index.doc.current.docs.length;
      };

      const format = (edge: SampleEdge) => {
        const uri = edge.repo.index.doc.uri;
        return {
          total: total(edge),
          'index:uri': Crdt.Uri.id(uri, { shorten: 6 }),
          'index:doc': edge.repo.index.doc.current,
        };
      };

      const data = { [`index[${total(left)}]`]: format(left) };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
