import { css, Color, PropList, Dev, t } from '../../test.ui';
import { CrdtInfo, CrdtInfoProps } from '.';

type T = {
  props: CrdtInfoProps;
  debug: { tracelines: boolean; bg: boolean };
};
const initial: T = {
  props: {},
  debug: { tracelines: false, bg: false },
};

export default Dev.describe('CrdtInfo', (e) => {
  type LocalStore = T['debug'];
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.crdt.CrdtInfo');
  const local = localstore.object({ bg: true, tracelines: false });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => (d.debug = local));

    ctx.subject.display('grid').render<T>((e) => {
      const { debug, props } = e.state;
      return (
        <CrdtInfo
          {...props}
          padding={debug.bg ? [20, 25] : 0}
          style={{
            width: debug.bg ? 300 : 250,
            backgroundColor: Color.format(debug.bg ? 1 : 0),
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => (
        <Dev.Object name={'Dev.CrdtInfo'} data={{ props: e.state.props }} expand={1} />
      ));

    dev.section((dev) => {
      dev.boolean((btn) =>
        btn
          .label('background')
          .value((e) => e.state.debug.bg)
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );

      dev.boolean((btn) =>
        btn
          .label('debug: tracelines')
          .enabled(false)
          .value((e) => e.state.debug.tracelines)
          .onClick((e) => e.change((d) => (local.tracelines = Dev.toggle(d.debug, 'tracelines')))),
      );
    });

    dev.hr();

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = e.state.props;
        return (
          <PropList.FieldSelector
            style={{ Margin: [0, 10, 0, 25] }}
            all={CrdtInfo.FIELDS}
            selected={props.fields ?? CrdtInfo.DEFAULTS.fields}
            onClick={(ev) => {
              console.log('⚡️ FieldSelector.onClick:', ev);
              dev.change((d) => (d.props.fields = ev.next as CrdtInfoProps['fields']));
            }}
          />
        );
      });
    });

    dev.hr(5, 30);

    dev.section('Component', (dev) => {
      dev.hr(0, 5);
      dev.row((e) => {
        return <CrdtInfo {...e.state.props} style={{ Margin: [0, 10, 0, 10] }} />;
      });
    });
  });
});
