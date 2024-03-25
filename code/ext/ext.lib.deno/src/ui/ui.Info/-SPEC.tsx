import { Info, DEFAULTS } from '.';
import { Delete, Dev, Hash, Pkg, type t } from '../../test.ui';
import { Http } from './common';

type P = t.InfoProps;
type T = {
  props: P;
  state?: t.InfoData;
  accessToken?: string;
  debug: { forcePublicUrl?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = Info.displayName ?? 'Unknown';
export default Dev.describe(name, async (e) => {
  type LocalStore = Pick<P, 'fields' | 'stateful' | 'flipped' | 'theme'> & T['debug'];
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: undefined,
    fields: DEFAULTS.fields.default,
    stateful: true,
    flipped: false,
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

      d.props.theme = local.theme;
      d.props.fields = local.fields;
      d.props.stateful = local.stateful;
      d.props.flipped = local.flipped;
      d.props.margin = 10;
      d.props.data = {
        endpoint: {},
        projects: {
          onSelect(e) {
            console.info('⚡️ projects.onSelect', e.project.id);
            if (!state.current.props.stateful) {
              const id = e.project.id;
              state.change((d) => (d.props.data!.projects!.selected = id));
            }
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
        const { props, debug } = e.state;
        Dev.Theme.background(dev, props.theme, 1);
        const accessToken = getTokens(dev.ctx, e.state).accessToken;
        const forcePublic = debug.forcePublicUrl;
        const data: t.InfoData = {
          ...props.data,
          endpoint: { ...props.data?.endpoint, forcePublic, accessToken },
        };
        return (
          <Info
            {...props}
            data={data}
            onStateChange={(data) => state.change((d) => (d.state = data))}
          />
        );
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
          onChange={(e) => state.change((d) => (d.accessToken = e.accessToken))}
        />
      );
    });

    if (!tokens.env) dev.hr(5, 20);

    dev.section('Fields', (dev) => {
      const setFields = (fields?: t.InfoField[]) => {
        dev.change((d) => (d.props.fields = fields));
        local.fields = fields?.length === 0 ? undefined : fields;
      };

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
                  : (ev.next as t.InfoField[]);
              setFields(fields);
            }}
          />
        );
      });

      dev.title('Common States');
      const common = (label: string, fields: t.InfoField[]) => {
        dev.button(label, (e) => e.change((d) => setFields(fields)));
      };
      common('all', DEFAULTS.fields.all);
      common('projects', ['Auth.AccessToken', 'Projects.List']);
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.stateful;
        btn
          .label((e) => 'stateful')
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.stateful = Dev.toggle(d.props, 'stateful'))));
      });

      dev.hr(-1, 5);

      Dev.Theme.switch(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );
      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.flipped;
        btn
          .label((e) => 'flipped')
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.flipped = Dev.toggle(d.props, 'flipped'))));
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
        const value = (state: T) => !!state.debug.forcePublicUrl;
        btn
          .label((e) => `force public url`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => {
              const next = (local.forcePublicUrl = Dev.toggle(d.debug, 'forcePublicUrl'));
              d.props.data!.endpoint!.forcePublic = next;
            });
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
        'state:onChange': e.state.state ? e.state.state : undefined,
      };
      return <Dev.Object name={name} data={Delete.undefined(data)} expand={1} fontSize={11} />;
    });
  });
});
