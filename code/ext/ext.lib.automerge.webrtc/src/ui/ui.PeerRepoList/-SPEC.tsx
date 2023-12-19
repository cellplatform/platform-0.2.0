import { PeerRepoList } from '.';
import { COLORS, Color, Dev, Doc, PeerUI, TestDb, css, type t } from '../../test.ui';
import { createEdge } from '../ui.Sample.02';

type T = { props: t.PeerRepoListProps; debug: { reload?: boolean } };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = PeerRepoList.displayName ?? '';
export default Dev.describe(name, async (e) => {
  const self = await createEdge('Left');
  const remote = await createEdge('Right');
  const peer = {
    self: self.network.peer,
    remote: remote.network.peer,
  } as const;

  let repo: t.RepoListModel;
  let network: t.WebrtcStore;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    repo = self.repo;
    network = self.network;

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

    dev.row((e) => {
      return (
        <PeerRepoList.Info
          title={'Network'}
          fields={['Repo', 'Peer', 'Network.Shared', 'Network.Shared.Json']}
          data={{ network }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('connect network', (e) => peer.self.connect.data(peer.remote.id));
      dev.button('redraw', (e) => dev.redraw());

      dev.hr(-1, 5);

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

    dev.footer
      .padding(0)
      .border(-0.1)
      .render<T>((e) => {
        const total = (index: t.StoreIndexState) => {
          return index.doc.current.docs.length;
        };

        const format = (index: t.StoreIndexState) => {
          const uri = index.doc.uri;
          return {
            total: total(index),
            'index:uri': Doc.Uri.id(uri, { shorten: 6 }),
            'index:doc': index.doc.current,
          };
        };

        const data = { [`index[${total(network.index)}]`]: format(network.index) };
        const styles = {
          base: css({}),
          obj: css({ margin: 8 }),
          conn: css({ borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}` }),
        };

        return (
          <div {...styles.base}>
            <Dev.Object name={name} data={data} expand={1} style={styles.obj} />
            <PeerUI.Connector peer={peer.remote} style={styles.conn} />
          </div>
        );
      });
  });
});
