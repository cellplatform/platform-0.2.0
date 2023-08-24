import { Info } from '.';
import { Dev, appId, type t } from '../../test.ui';

type T = { props: t.InfoProps };
const initial: T = { props: {} };
const DEFAULTS = Info.DEFAULTS;

/**
 * Spec
 */
const name = Info.displayName ?? '⚠️';
export default Dev.describe(name, (e) => {
  type LocalStore = { selectedFields?: t.InfoField[] } & Pick<t.InfoProps, 'useAuthProvider'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.wallet.privy.Info');
  const local = localstore.object({
    selectedFields: DEFAULTS.fields.default,
    useAuthProvider: DEFAULTS.useAuthProvider,
  });

  const State = {
    props(state: T): t.InfoProps {
      const data: t.InfoData = { provider: { appId } };
      return { ...state.props, data };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.margin = 10;
      d.props.fields = local.selectedFields;
      d.props.useAuthProvider = local.useAuthProvider;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([320, null])
      .display('grid')
      .render<T>((e) => {
        const props = State.props(e.state);
        return (
          <Info
            {...props}
            onChange={(e) => {
              console.info(`⚡️ onChange`, e);
            }}
          />
        );
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
                  : (ev.next as t.InfoProps['fields']);
              dev.change((d) => (d.props.fields = fields));
              local.selectedFields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.useAuthProvider);
        btn
          .label((e) => `useAuthProvider`)
          .value((e) => value(e.state))
          .onClick((e) =>
            e.change((d) => (local.useAuthProvider = Dev.toggle(d.props, 'useAuthProvider'))),
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
