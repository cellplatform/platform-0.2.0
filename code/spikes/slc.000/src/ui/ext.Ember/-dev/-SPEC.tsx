import { Dev, type t } from '../../../test.ui';
import { Root, type RootProps } from '..';
import { DATA } from './-data.mjs';

type T = {
  props: RootProps;
  debug: { withSlugs?: boolean };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('Landing.Ember', (e) => {
  type LocalStore = Pick<T['debug'], 'withSlugs'> & Pick<RootProps, 'selected'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:landing.ember');
  const local = localstore.object({
    withSlugs: true,
    selected: -1,
  });

  const State = {
    displayProps(state: T): RootProps {
      const { debug } = state;
      const props: RootProps = {
        ...state.props,
        slugs: debug.withSlugs ? DATA.slugs : undefined,
      };
      return props;
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.selected = local.selected;
      d.debug.withSlugs = local.withSlugs;
    });

    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const props = State.displayProps(e.state);
        return (
          <Root
            {...props}
            onSelect={(e) => {
              state.change((d) => (d.props.selected = e.index));
              local.selected = e.index;
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state);
        btn
          .label((e) => `with slugs (data)`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.withSlugs = Dev.toggle(d.debug, 'withSlugs'))));
      });

      dev.hr(5, 20);

      const select = (index: number) => {
        dev.button((btn) => {
          const value = (state: T) => state.props.selected ?? -1;
          btn
            .label((e) => `select: ${index}`)
            .right((e) => (value(e.state) === index ? '←' : ''))
            .onClick((e) => e.change((d) => (local.selected = d.props.selected = index)));
        });
      };

      select(-1);
      dev.hr(-1, 5);
      Array.from({ length: 5 }).forEach((v, i) => select(i));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const props = State.displayProps(e.state);
      const data = { props };
      return <Dev.Object name={'Landing.Ember'} data={data} expand={1} />;
    });
  });
});
