import { Info, type InfoProps } from '.';
import { Dev, Pkg, type t, Hash } from '../../test.ui';
import { Http } from './common';

type T = {
  props: InfoProps;
  accessToken?: string;
  debug: { forcePublicUrl?: boolean };
};
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

  const getTokens = (ctx: t.DevCtx, state: T) => {
    const env = (ctx.env?.accessToken ?? '') as string;
    const prop = state.accessToken;
    const accessToken = env || prop;
    return { prop, env, accessToken } as const;
  };

  e.it('ui:init', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    await state.change((d) => {
      d.debug.forcePublicUrl = local.forcePublicUrl;

      d.props.fields = local.selectedFields;
      d.props.margin = 10;
      d.props.data = {
        projects: {
          onSelect(e) {
            const projectId = e.project.id;
            state.change((d) => (d.props.data!.projects!.selected = projectId));
          },
        },
      };
    });

    dev.ctx.debug.width(300);
    dev.ctx.subject
      .backgroundColor(1)
      .size([320, null])
      .display('grid')
      .render<T>(async (e) => {
        const props = e.state.props;
        const accessToken = getTokens(dev.ctx, e.state).accessToken;
        const data = { ...props.data, auth: { accessToken } };
        return <Info {...props} data={data} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);
    const tokens = getTokens(dev.ctx, state.current);

    dev.row(async (e) => {
      if (tokens.env) return;

      const { Auth } = await import('ext.lib.privy');
      return (
        <Auth.Info
          title={'Identity'}
          fields={['Login', 'Login.SMS', 'Login.Farcaster', 'Id.User', 'Link.Farcaster']}
          data={{ provider: Auth.Env.provider }}
          onChange={(e) => {
            console.info('⚡️ Auth.onChange:', e);
            state.change((d) => (d.accessToken = e.accessToken));
          }}
        />
      );
    });

    if (!tokens.env) dev.hr(5, 20);

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

    dev.hr(5, 20);

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

    dev.footer.border(-0.1).render<T>(async (e) => {
      const tokens = getTokens(dev.ctx, e.state);
      const { debug, props } = e.state;
      const forcePublic = debug.forcePublicUrl;
      const data = {
        props,
        origin: Http.origin({ forcePublic }),
        accessToken: tokens.prop ? `${Hash.shorten(tokens.prop, 6)}` : undefined,
        'accessToken.env': tokens.env ? `${Hash.shorten(tokens.env, 6)}` : undefined,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
