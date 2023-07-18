import { Dev, type t } from '../../../test.ui';
import { FieldSelector } from '..';
import { SampleFields } from './-common';

const DEFAULTS = FieldSelector.DEFAULTS;

type T = {
  props: t.PropListFieldSelectorProps;
  debug: { hostBg?: boolean };
};
const initial: T = {
  props: { all: SampleFields.all },
  debug: {},
};

export default Dev.describe('PropList.FieldSelector', (e) => {
  type LocalStore = Pick<t.PropListFieldSelectorProps, 'resettable' | 'indexes' | 'selected'> &
    Pick<T['debug'], 'hostBg'> & { hasTitle?: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.PropList.FieldSelector');
  const local = localstore.object({
    resettable: DEFAULTS.resettable,
    indexes: DEFAULTS.indexes,
    hostBg: false,
    hasTitle: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.resettable = local.resettable;
      d.props.indexes = local.indexes;
      d.props.selected = local.selected;
      d.props.title = local.hasTitle ? 'My Title' : undefined;
      d.debug.hostBg = local.hostBg;
    });

    ctx.subject
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        ctx.subject.backgroundColor(debug.hostBg ? 1 : 0);
        const margin = debug.hostBg ? 10 : 0;
        return <FieldSelector {...e.state.props} style={{ margin }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.title);
        btn
          .label((e) => `title`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => {
              local.hasTitle = !value(d);
              const title = local.hasTitle ? 'My Title' : undefined;
              d.props.title = title;
            });
          });
      });

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.indexes);
        btn
          .label((e) => `indexes (${value(e.state) ? 'visible' : 'hidden'})`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.indexes = Dev.toggle(d.props, 'indexes'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.resettable);
        btn
          .label((e) => `resettable`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.resettable = Dev.toggle(d.props, 'resettable'))));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.hostBg);
        btn
          .label((e) => `background`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.hostBg = Dev.toggle(d.debug, 'hostBg'))));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'PropList.FieldSelector'} data={data} expand={1} />;
    });
  });
});
