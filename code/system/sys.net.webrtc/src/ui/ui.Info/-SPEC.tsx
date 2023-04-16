import { Dev, css, PropList, t } from '../../test.ui';
import { WebRtcInfo, WebRtcInfoProps } from '.';

type T = {
  props: WebRtcInfoProps;
  debug: { bg: boolean; title: boolean };
};
const initial: T = {
  props: {},
  debug: { bg: true, title: false },
};

export default Dev.describe('WebRtcInfo', (e) => {
  type LocalStore = T['debug'] & { fields?: t.WebRtcInfoFields[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.net.webrtc.Info');
  const local = localstore.object({
    bg: initial.debug.bg,
    title: initial.debug.title,
    fields: initial.props.fields,
  });

  const Util = {
    props(state: T): WebRtcInfoProps {
      const { debug, props } = state;
      return {
        ...props,
        title: debug.title ? ['Network', 'WebRTC'] : undefined,
      };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.fields = local.fields;
      d.debug.bg = local.bg;
      d.debug.title = local.title;
    });

    ctx.subject.display('grid').render<T>((e) => {
      const { debug } = e.state;
      const props = Util.props(e.state);
      ctx.subject.backgroundColor(debug.bg ? 1 : 0);
      ctx.subject.size([320, null]);

      const base = css({ Padding: debug.bg ? [20, 25] : 0 });
      return (
        <div {...base}>
          <WebRtcInfo {...props} card={false} />
        </div>
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = Util.props(e.state);
        return (
          <PropList.FieldSelector
            style={{ Margin: [10, 40, 10, 30] }}
            all={WebRtcInfo.FIELDS}
            selected={props.fields ?? WebRtcInfo.DEFAULTS.fields}
            onClick={(ev) => {
              let fields = ev.next as WebRtcInfoProps['fields'];
              dev.change((d) => (d.props.fields = fields));
              local.fields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });

    dev.section((dev) => {
      dev.row((e) => {
        const props = Util.props(e.state);
        return <WebRtcInfo {...props} card={true} margin={[15, 25, 40, 25]} />;
      });

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => 'title')
          .value((e) => e.state.debug.title)
          .onClick((e) => e.change((d) => (local.title = Dev.toggle(d.debug, 'title')))),
      );

      dev.boolean((btn) =>
        btn
          .label('background')
          .value((e) => e.state.debug.bg)
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'WebRtcInfo'} data={data} expand={1} />;
    });
  });
});
