import { PeerRepoList } from '.';
import { Dev, TestDb, type t } from '../../test.ui';
import { createEdge } from '../ui.Sample.02';

type T = { props: t.PeerRepoListProps; debug: { reload?: boolean } };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = PeerRepoList.displayName ?? '';
export default Dev.describe(name, (e) => {
  let repo: t.RepoListModel;
  let network: t.WebrtcStore;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const model = await createEdge('Left');
    repo = model.repo;
    network = model.network;

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
          return <TestDb.DevReload style={{ width }} onCloseClick={resetReloadClose} />;
        } else {
          return (
            <PeerRepoList {...e.state.props} repo={repo} network={network} style={{ width }} />
          );
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

    /**
     * TODO 🐷
     */

    //     dev.footer.border(-0.1).render<T>((e) => {
    //       const total = (edge: t.PeerRepoList) => {
    //         return edge.repo.index.doc.current.docs.length;
    //       };
    //
    //       const format = (edge: t.PeerRepoList) => {
    //         const uri = edge.repo.index.doc.uri;
    //         return {
    //           total: total(edge),
    //           'index:uri': Crdt.Uri.id(uri, { shorten: 6 }),
    //           'index:doc': edge.repo.index.doc.current,
    //         };
    //       };
    //
    //       const data = { [`index[${total(left)}]`]: format(left) };
    //       return <Dev.Object name={name} data={data} expand={1} />;
    // });
  });
});
