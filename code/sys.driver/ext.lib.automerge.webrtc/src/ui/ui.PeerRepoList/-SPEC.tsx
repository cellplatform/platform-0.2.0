import { DEFAULTS, PeerRepoList } from '.';
import { COLORS, Color, Dev, Doc, PeerUI, Pkg, TestDb, TestEdge, css, type t } from '../../test.ui';

type T = { props: t.PeerRepoListProps; debug: { reload?: boolean } };
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = PeerRepoList.displayName ?? '';
export default Dev.describe(name, async (e) => {
  const self = await TestEdge.create('Left', {
    behaviors: ['Focus.OnArrowKey', 'Shareable', 'Deletable', 'Copyable'],
  });
  const remote = await TestEdge.create('Right');
  const peer = {
    self: self.network.peer,
    remote: remote.network.peer,
  } as const;

  let model: t.RepoListModel;
  let network: t.NetworkStore;

  type LocalStore = Pick<t.PeerRepoListProps, 'focusOnLoad' | 'avatarTray'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    focusOnLoad: DEFAULTS.focusPeerOnLoad,
    avatarTray: DEFAULTS.avatarTray,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    model = self.model;
    network = self.network;

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.focusOnLoad = local.focusOnLoad;
      d.props.avatarTray = local.avatarTray;
    });
    const resetReloadClose = () => state.change((d) => (d.debug.reload = false));

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-y')
      .display('grid')
      .render<T>((e) => {
        const width = 250;
        const { props, debug } = e.state;
        if (debug.reload) {
          return <TestDb.DevReload style={{ width }} onCloseClick={resetReloadClose} />;
        } else {
          return <PeerRepoList {...props} model={model} network={network} style={{ width }} />;
        }
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <PeerRepoList.Info
          stateful={true}
          title={'Network'}
          fields={['Repo', 'Peer', 'Network.Transfer', 'Network.Shared']}
          network={network}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.focusOnLoad);
        btn
          .label((e) => `focusOnLoad`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.focusOnLoad = Dev.toggle(d.props, 'focusOnLoad')));
          });
      });

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.avatarTray;
        btn
          .label((e) => `avatarTray`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'avatarTray')));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.button(['connect network', '⚡️'], (e) => peer.self.connect.data(peer.remote.id));
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
        const total = (index: t.StoreIndex) => {
          return index.doc.current.docs.length;
        };

        const format = (index: t.StoreIndex) => {
          const uri = index.doc.uri;
          return {
            total: total(index),
            'index:uri': Doc.Uri.id(uri, { shorten: 6 }),
            'index:doc': index.doc.current,
          };
        };

        const index = network.repo.index;
        const data = { [`index[${total(index)}]`]: format(index) };
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
