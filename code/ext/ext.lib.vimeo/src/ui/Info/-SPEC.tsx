import { Info } from '.';
import { Dev, type t } from '../../test.ui';

type P = t.InfoProps;
type T = { props: P };
const initial: T = { props: {} };

export default Dev.describe('Info', (e) => {
  type LocalStore = Pick<P, 'fields'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:NAMESPACE');
  const local = localstore.object({
    fields: Info.DEFAULTS.fields,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.props.fields = local.fields;
      d.props.margin = 10;
    });

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
    dev.TODO();

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
            all={Info.FIELDS}
            selected={props.fields}
            onClick={(e) => {
              const next = e.next<t.InfoField>();
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
      return <Dev.Object name={'Info'} data={data} expand={1} />;
    });
  });
});
