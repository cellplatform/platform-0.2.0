import { CmdBar, DEFAULTS } from '.';
import {
  Color,
  Dev,
  Doc,
  Pkg,
  TestDb,
  WebStore,
  css,
  BroadcastChannelNetworkAdapter,
} from '../../test.ui';
import { Info } from '../ui.Info';
import { RepoList } from '../ui.RepoList';
import { type t } from './common';

type P = t.CmdBarProps;
type T = { props: P; debug: { docuri?: t.UriString } };
const initial: T = { props: {}, debug: {} };

/**
 * Sample CRDT Store and Document Setup
 */
async function createStore() {
  const db = TestDb.Spec;
  const network = [new BroadcastChannelNetworkAdapter()];
  const store = WebStore.init({ storage: db.name, network });
  const index = await WebStore.index(store);
  return { store, index } as const;
}

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & Pick<P, 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    docuri: undefined,
  });

  const db = await createStore();
  const store = db.store;
  const index = db.index;
  let model: t.RepoListModel;
  let ref: t.RepoListRef;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.debug.docuri = local.docuri;
    });

    model = await RepoList.model(db.store, {
      behaviors: ['Copyable', 'Deletable'],
      onReady: (e) => (ref = e.ref),
      onActiveChanged(e) {
        console.info(`⚡️ onActiveChanged`, e);
        state.change((d) => (local.docuri = d.debug.docuri = e.item.uri));
      },
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props } = e.state;
        Dev.Theme.background(dev, props.theme, 1);
        return <CmdBar {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header.border(-0.1).render((e) => {
      return (
        <Info
          stateful={true}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: { store, index },
            document: {
              ref: state.current.debug.docuri,
              object: { visible: true },
            },
          }}
        />
      );
    });

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer
      .border(-0.1)
      .padding(0)
      .render<T>((e) => {
        const { props, debug } = e.state;
        const data = {
          docuri: Doc.Uri.id(debug.docuri, { shorten: 5 }),
          props,
        };

        const styles = {
          base: css({ position: 'relative' }),
          object: css({ padding: 10 }),
          list: css({ border: `solid 1px ${Color.alpha(Color.DARK, 0.15)}` }),
        };

        const elObject = (
          <div {...styles.object}>
            <Dev.Object name={name} data={data} expand={1} fontSize={11} />
          </div>
        );

        const elList = (
          <div {...styles.list}>
            <RepoList model={model} onReady={(e) => e.ref.select(0)} style={{}} />
          </div>
        );

        return (
          <div {...styles.base}>
            {elObject}
            {elList}
          </div>
        );
      });
  });
});
