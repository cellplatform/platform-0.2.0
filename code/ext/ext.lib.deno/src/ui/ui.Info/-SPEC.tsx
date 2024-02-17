import { Info, type InfoProps } from '.';
import { Dev, Pkg, type t } from '../../test.ui';
import { Http } from './common';

type T = { props: InfoProps; debug: { forcePublicUrl?: boolean } };
const initial: T = { props: {}, debug: {} };
const DEFAULTS = Info.DEFAULTS;

/**
 * Spec
 */
const name = Info.displayName ?? 'Unknown';
export default Dev.describe(name, (e) => {
  type LocalStore = { selectedFields?: t.InfoField[] } & T['debug'];
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    selectedFields: DEFAULTS.fields.default,
    forcePublicUrl: false,
  });

  const getClient = (state: T) => {
    const forcePublic = state.debug.forcePublicUrl;
    return Http.client({ forcePublic });
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.forcePublicUrl = local.forcePublicUrl;

      d.props.fields = local.selectedFields;
      d.props.margin = 10;
      d.props.data = {
        projects: {
          onSelect: (e) => state.change((d) => (d.props.data!.projects!.selected = e.id)),
        },
      };
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
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.section('Fields', (dev) => {
      dev.row((e) => {
        const props = e.state.props;
        return (
          <Dev.FieldSelector
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

    dev.section('HTTP', (dev) => {
      dev.button('get: projects.list', async (e) => {
        const client = getClient(state.current);
        const res = await client.projects.list();
        await e.change((d) => (d.props.data!.projects!.list = res.projects));
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.forcePublicUrl);
        btn
          .label((e) => `force public url`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.forcePublicUrl = Dev.toggle(d.debug, 'forcePublicUrl')));
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const { debug, props } = e.state;
      const forcePublic = debug.forcePublicUrl;
      const data = {
        origin: Http.origin({ forcePublic }),
        props,
      };

      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
