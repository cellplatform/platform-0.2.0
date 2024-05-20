import { Info } from '.';
import { Dev, type t } from '../../test.ui';

type P = t.InfoProps;
type T = { props: P };
const initial: T = { props: {} };
const DEFAULTS = Info.DEFAULTS;

/**
 * Spec
 */
const name = Info.displayName ?? 'Unknown';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<P, 'fields'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.data.indexeddb.Info');
  const local = localstore.object({
    fields: DEFAULTS.fields.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.fields = local.fields;
      d.props.margin = 10;
    });

    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size([320, null])
      .display('grid')
      .render<T>((e) => {
        return <Info {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
            all={DEFAULTS.fields.all}
            selected={props.fields}
            onClick={(e) => {
              const next = e.next<t.InfoField>(DEFAULTS.fields.default);
              dev.change((d) => (local.fields = d.props.fields = next));
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
