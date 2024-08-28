import { DEFAULTS, RepoList } from '.';
import { Dev, DevReload, Doc, Pkg, TestDb, Time, WebStore, rx, slug, type t } from '../../test.ui';
import { Info } from '../ui.Info';

type P = t.RepoListProps;
type T = {
  props: P;
  debug: { reload?: boolean; cancelDelete?: boolean };
};
const name = RepoList.displayName ?? 'Unknown';
const initial: T = { props: {}, debug: {} };

export default Dev.describe(name, async (e) => {
  const storage = TestDb.Spec.name;

  let model: t.RepoListModel;
  let ref: t.RepoListRef;
  let active: t.RepoListActiveChangedEventArgs | undefined;

  type LocalStore = Pick<t.RepoListProps, 'newlabel'> &
    Pick<T['debug'], 'cancelDelete'> &
    Pick<t.RepoListModel, 'behaviors'>;

  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.ui.${name}`);
  const local = localstore.object({
    behaviors: DEFAULTS.behaviors.default,
    newlabel: DEFAULTS.newlabel,
    cancelDelete: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const store = WebStore.init({ storage });
    model = await RepoList.model(store, {
      behaviors: () => local.behaviors || [],
      onReady: (e) => console.info(`⚡️ onReady`, e),
      onDatabaseClick: (e) => console.info(`⚡️ onDatabaseClick`, e),
      onShareClick: (e) => console.info(`⚡️ onShareClick`, e),
      onActiveChanged: (e) => {
        console.info(`⚡️ onActiveChanged`, e);
        active = e;
      },
    });

    ref = RepoList.Ref(model); // NB: or store reference from the [⚡️:onReady] event.

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.newlabel = local.newlabel;
      d.debug.cancelDelete = local.cancelDelete;
    });

    const events = {
      list: model.list.state.events(),
      index: model.index.events(),
      repo: model.events(),
    };

    const redraw$ = rx.merge(events.list.$, events.list.active.$);
    redraw$.pipe(rx.debounceTime(100)).subscribe(() => dev.redraw('debug'));
    events.index.changed$.subscribe(() => dev.redraw('debug'));

    events.index.shared$.subscribe((e) => console.info('⚡️ shared', e));
    events.repo.deleted$.subscribe((e) => console.info('⚡️ deleted', e));
    events.repo.deleting$.subscribe((e) => {
      if (state.current.debug.cancelDelete) e.cancel();
      console.info('⚡️ deleting', e);
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([330, null])
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        if (debug.reload) return <DevReload />;

        const count: t.RenderCountProps = {
          prefix: 'list.render-',
          absolute: [-20, 2, null, null],
          opacity: 0.2,
        };

        return (
          <RepoList
            {...props}
            model={model}
            renderCount={count}
            onReady={(e) => console.info('⚡️ onReady', e)}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      const name = '<RepoList>';
      const { store, index } = model;
      return (
        <Info
          fields={['Component', 'Repo']}
          repos={{ main: { store, index } }}
          data={{ repo: 'main', component: { name } }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section((dev) => {
      dev.row((e) => {
        return (
          <RepoList.Config
            //
            selected={local.behaviors}
            onChange={(e) => setBehaviors(e.next)}
          />
        );
      });

      const setBehaviors = (next?: t.RepoListBehavior[]) => {
        local.behaviors = next || [];
        dev.redraw();
      };

      dev.button('set: common configuration', (e) => {
        setBehaviors(['Focus.OnArrowKey', 'Shareable', 'Deletable']);
      });
    });

    dev.hr(-1, [5, 15]);

    dev.textbox((txt) => {
      txt
        .label((e) => 'insert label ( + )')
        .value((e) => e.state.props.newlabel)
        .onChange((e) => e.change((d) => (local.newlabel = d.props.newlabel = e.to.value)));
    });

    dev.hr(5, 20);

    dev.section('ref ( ƒ )', (dev) => {
      const select = (target: t.LabelListItemTarget, focus = true) => {
        Time.delay(0, () => ref.select(target, focus));
      };
      dev.button('select: first', (e) => select('First', false));
      dev.button(['select: last', '(and focus)'], (e) => select('Last', true));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

      dev.boolean((btn) => {
        const value = (state: T) => !!state.debug.cancelDelete;
        btn
          .label((e) => `cancel delete (via ⚡️)`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.cancelDelete = Dev.toggle(d.debug, 'cancelDelete')));
          });
      });

      dev.hr(-1, 5);

      dev.button('create: doc', async (e) => {
        type T = { msg?: string };
        await model.store.doc.getOrCreate<T>((d) => null);
      });
      dev.button(['create: doc ("ephemeral")', 'filtered out'], async (e) => {
        type D = t.DocWithMeta;
        await model.store.doc.getOrCreate<D>((d) => {
          Doc.Meta.get(d, { mutate: true, initial: { ephemeral: true } });
        });
      });
      dev.button('delete: doc (last)', async (e) => {
        const index = model.index;
        const docs = index.doc.current.docs.filter((m) => !m.meta?.ephemeral);
        const last = docs[docs.length - 1];
        const uri = last?.uri;
        const removed = index.remove(uri);
        console.info('💥 removed:', removed, '←', uri);
      });

      dev.hr(-1, 5);

      dev.button('mutate: rename first', (e) => {
        model.index.doc.change((d) => {
          const first = d.docs.find((m) => !m.meta?.ephemeral);
          if (first) first.name = `renamed: ${slug()}`;
        });
      });

      dev.hr(-1, 5);

      dev.button([`delete database: "${storage}"`, '💥'], async (e) => {
        await e.state.change((d) => (d.debug.reload = true));
        await TestDb.Spec.deleteDatabase();
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      if (!model) return;
      const { props } = e.state;
      const data = {
        props,
        'model:list': model.list.state.current,
        db: storage,
        'db:index': `${model.index.db.name}[${model.index.total()}]`,
        'db:index.doc': model.index.doc.toObject(),
        'active:focus': !!active?.focused,
        'active:item': active?.item || undefined,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
