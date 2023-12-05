import { RepoList } from '.';
import { rx, Dev, Doc, TestDb, Time, WebStore, slug, type t } from '../../test.ui';
import { SpecInfo } from './-SPEC.ui.Info';
import { Reload } from './-SPEC.ui.Reload';

type T = { props: t.RepoListProps; debug: { reload?: boolean } };
const name = RepoList.displayName ?? '';
const initial: T = { props: {}, debug: {} };

export default Dev.describe(name, async (e) => {
  const storage = TestDb.Spec.name;
  const store = WebStore.init({ storage });

  let model: t.RepoListModel;
  let ref: t.RepoListRef;

  type LocalStore = Pick<t.RepoListProps, 'behaviors' | 'newlabel'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.automerge.ui.RepoList');
  const local = localstore.object({
    behaviors: RepoList.DEFAULTS.behaviors.default,
    newlabel: RepoList.DEFAULTS.newlabel,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    model = await RepoList.model(store, {
      onDatabaseClick: (e) => console.info(`⚡️ onDatabaseClick`, e),
      onShareClick: (e) => console.info(`⚡️ onShareClick`, e),
    });
    ref = RepoList.Ref(model);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.behaviors = local.behaviors;
      d.props.newlabel = local.newlabel;
    });

    const events = {
      list: model.list.state.events(),
      index: model.index.events(),
    };
    events.list.$.pipe(rx.debounceTime(100)).subscribe(() => dev.redraw('debug'));
    events.index.changed$.subscribe(() => dev.redraw('debug'));
    events.index.shared$.subscribe((e) => console.log('⚡️ shared$', e));

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([330, null])
      .display('grid')
      .render<T>((e) => {
        if (e.state.debug.reload) return <Reload />;

        const renderCount: t.RenderCountProps = {
          prefix: 'list.render-',
          absolute: [-20, 2, null, null],
          opacity: 0.2,
        };
        return <RepoList {...e.state.props} list={model} renderCount={renderCount} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.row((e) => <SpecInfo model={model} />);

    dev.hr(5, 20);

    dev.row((e) => {
      return (
        <RepoList.Config
          selected={e.state.props.behaviors}
          onChange={(e) => {
            state.change((d) => (d.props.behaviors = e.next));
            local.behaviors = e.next;
          }}
        />
      );
    });

    dev.textbox((txt) => {
      txt
        .label((e) => 'insert label ( + )')
        .value((e) => e.state.props.newlabel)
        .onChange((e) => e.change((d) => (local.newlabel = d.props.newlabel = e.to.value)));
    });

    dev.hr(5, 20);

    dev.section('ref ( ƒ )', (dev) => {
      const select = (target: t.LabelListItemTarget) => {
        const focus = true;
        Time.delay(0, () => ref.select(target, focus));
      };
      dev.button('select: first', (e) => select('First'));
      dev.button('select: last', (e) => select('Last'));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

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
        const removed = await index.remove(uri);
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
        e.state.change((d) => (d.debug.reload = true));
        await TestDb.Spec.deleteDatabase();
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: e.state.props,
        list: model.list.state.current,
        db: storage,
        'db:index': `${model.index.db.name}[${model.index.total()}]`,
        'db:index.doc': model.index.doc.toObject(),
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
