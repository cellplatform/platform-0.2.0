import { ChainSelector } from '.';
import { Dev, type t } from '../../test.ui';

type T = { props: t.ChainSelectorProps };
const initial: T = { props: {} };
const { DEFAULTS } = ChainSelector;

export default Dev.describe('ChainSelector', (e) => {
  type LocalStore = {
    title?: string;
    selected?: t.ChainName[];
    resettable?: boolean;
    showIndexes?: boolean;
  };
  const localstore = Dev.LocalStorage<LocalStore>('dev:vendor.wallet.rainbow.ChainSelector');
  const local = localstore.object({
    title: DEFAULTS.title,
    selected: DEFAULTS.chains.default,
    resettable: DEFAULTS.resettable,
    showIndexes: DEFAULTS.showIndexes,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.title = local.title;
      d.props.selected = local.selected;
      d.props.resettable = local.resettable;
      d.props.showIndexes = local.showIndexes;
    });

    ctx.subject
      .backgroundColor(1)
      .size([280, null])
      .display('grid')
      .render<T>((e) => {
        return (
          <ChainSelector
            {...e.state.props}
            onChange={(e) => {
              state.change((d) => (d.props.selected = e.next));
              local.selected = e.empty ? undefined : e.next;
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `title`)
          .value((e) => Boolean(e.state.props.title))
          .onClick((e) => {
            local.title = !e.current ? DEFAULTS.title : '';
            e.change((d) => (d.props.title = local.title));
          }),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `resettable`)
          .value((e) => Boolean(e.state.props.resettable))
          .onClick((e) => {
            e.change((d) => (local.resettable = Dev.toggle(d.props, 'resettable')));
          }),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `showIndexes`)
          .value((e) => Boolean(e.state.props.showIndexes))
          .onClick((e) => {
            e.change((d) => (local.showIndexes = Dev.toggle(d.props, 'showIndexes')));
          }),
      );

      dev.hr(5, 20);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'ChainSelector'} data={data} expand={1} />;
    });
  });
});
