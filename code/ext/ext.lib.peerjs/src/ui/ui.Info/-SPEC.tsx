import { Info, type InfoProps } from '.';
import { Dev, Webrtc, type t } from '../../test.ui';
import { Connector } from '../ui.Connector';

type T = { props: InfoProps };
const initial: T = { props: {} };
const DEFAULTS = Info.DEFAULTS;

/**
 * Spec
 */
const name = Info.displayName ?? '⚠️';
export default Dev.describe(name, (e) => {
  const self = Webrtc.peer();

  type LocalStore = { selectedFields?: t.InfoField[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.lib.peerjs.Info');
  const local = localstore.object({
    selectedFields: DEFAULTS.fields.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.fields = local.selectedFields;
      d.props.margin = 10;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([320, null])
      .display('grid')
      .render<T>((e) => {
        return <Info {...e.state.props} data={{ peer: { self } }} />;
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => {
        return <Connector peer={self} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
            style={{ Margin: [10, 40, 10, 30] }}
            all={DEFAULTS.fields.all}
            selected={props.fields}
            onClick={(ev) => {
              const fields =
                ev.action === 'Reset:Default'
                  ? DEFAULTS.fields.default
                  : (ev.next as InfoProps['fields']);
              dev.change((d) => (d.props.fields = fields));
              local.selectedFields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
