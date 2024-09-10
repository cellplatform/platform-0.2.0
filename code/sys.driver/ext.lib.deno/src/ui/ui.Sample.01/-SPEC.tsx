import { Delete, Dev, Hash, Pkg } from '../../test.ui';
import { Info } from '../ui.Info';
import { HttpState, type TState } from './-SPEC.HttpState';
import { SAMPLE } from './-SPEC.sample';
import { DenoHttp, type t } from './common';
import { Sample } from './ui';

type TEnv = { accessToken?: string };
type P = t.SampleProps;
type T = TState & { props: P; accessToken?: string };
const initial: T = {
  props: {},
  deno: { projects: [], deployments: [] },
};

/**
 * Spec
 */
const name = 'Sample.01';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<P, 'code'> & Pick<T, 'forcePublicUrl'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    code: SAMPLE.code,
    forcePublicUrl: false,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.code = local.code;
      d.forcePublicUrl = local.forcePublicUrl;
      d.props.env = ctx.env;
    });

    ctx.debug.width(360);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return (
          <Sample
            {...e.state.props}
            onChange={(e) => state.change((d) => (local.code = d.props.code = e.content.text))}
            onCmdEnterKey={(e) => console.info('⚡️ onCmdEnterKey', e)}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);
    const env = (dev.ctx.env || {}) as TEnv;

    dev.row(async (e) => {
      if (env.accessToken) return;
      const { Auth } = await import('ext.lib.privy');
      return (
        <Auth.Info
          title={'Identity'}
          fields={['Login', 'Login.SMS', 'Login.Farcaster', 'Id.User', 'Farcaster']}
          data={{ provider: Auth.Env.provider }}
          onChange={(e) => {
            console.info('⚡️ Auth.onChange:', e);
            state.change((d) => (d.accessToken = e.accessToken));
          }}
        />
      );
    });

    if (!env.accessToken) dev.hr(5, 20);

    dev.TODO();
    dev.hr(0, 5);
    dev.row((e) => {
      const deno = e.state.deno;
      const accessToken = env.accessToken || e.state.accessToken;
      return (
        <Info
          title={'Deno Subhosting'}
          fields={['Auth.AccessToken', 'Projects.List']}
          stateful={true}
          data={{
            endpoint: { accessToken },
            projects: {
              list: deno.projects,
              selected: deno.selectedProject,
              onSelect: (e) => state.change((d) => (d.deno.selectedProject = e.project.id)),
              onOpenDeployment(e) {
                console.log('onDeploymentClick', e);
                const domain = e.deployment.domains[0];
                const href = `https://${domain}`;
                window.open(href, '_blank', 'noopener,noreferrer');
              },
            },
            deployments: { list: deno.deployments },
          }}
        />
      );
    });

    dev.hr(5, 20);

    link
      .title('References')
      .button('docs: deno → subhosting', 'https://docs.deno.com/subhosting')
      .hr()
      .button('tutorial (video)', 'https://github.com/denoland/subhosting_ide_starter')
      .button('tutorial (sample repo)', 'https://github.com/denoland/subhosting_ide_starter')
      .hr(5, 20);

    dev.section('Actions', (dev) => {
      dev.button('set sample: "code"', (e) => {
        e.change((d) => (local.code = d.props.code = SAMPLE.code));
      });

      dev.hr(-1, 5);

      // const getHttp = () => {
      //   const forcePublic = state.current.forcePublicUrl;
      //   const fetch = Http.fetcher({ forcePublic });
      //   const http = Http.toMethods(fetch);
      //   const client = Http.client(fetch);
      //   return { http, client } as const;
      // };
      const getSelectedProject = () => state.current.deno.selectedProject;

      const getClient = () => {
        const forcePublic = !!state.current.forcePublicUrl;
        const client = DenoHttp.client({ forcePublic });
        return client;
      };

      dev.button('💦 create project', async (e) => {
        // const http = getHttp().http;
        // const body = {
        //   // name: `foo-${slug()}`,
        //   description: `Sample project ${slug()}`,
        // };
        // const res = await http.post('deno/projects', body);
        // e.change((d) => (d.tmp = res.json));
      });
      dev.hr(-1, 5);

      // dev.button('💦 get projects', (e) => HttpState.updateProjects(state));

      // dev.button((btn) => {
      //   btn
      //     .label(`💦 get deployments`)
      //     .enabled((e) => !!getSelectedProject())
      //     .onClick((e) => HttpState.updateDeployments(state));
      // });

      const projectId = 'sweet-gnu-41';
      const projectDisplay = `"${projectId}"`;
      dev.button(['get deployments', projectDisplay], async () => {
        const client = getClient();

        const res = await client.deployments(projectId).list();
        console.log('res', res);
      });

      dev.hr(-1, 5);

      dev.button((btn) => {
        btn
          .label(`deploy`)
          .right(projectDisplay)
          // .enabled((e) => !!getSelectedProject())
          .onClick(async (e) => {
            // const projectId = 'sweet-gnu-41';
            const client = getClient();

            const content = state.current.props.code ?? '';
            const body: t.DenoDeployArgs = {
              entryPointUrl: 'main.ts',
              assets: { 'main.ts': { kind: 'file', content, encoding: 'utf-8' } },
              envVars: {},
            };

            const res = await client.deploy(projectId, body);

            // const path = `deno/projects/${projectId}/deployments`;
            // const res = await http.post(path, body);

            console.log('-------------------------------------------');
            console.log('res', res);

            const m = await res.whenReady({ silent: false });
            console.log('m', m);
            // await HttpState.updateDeployments(state);
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => !!state.forcePublicUrl;
        btn
          .label((e) => `force public url`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.forcePublicUrl = Dev.toggle(d, 'forcePublicUrl')));
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const { props, deno } = e.state;
      const jwt = e.state.accessToken;
      const forcePublic = e.state.forcePublicUrl;
      const data = {
        origin: DenoHttp.origin({ forcePublic }),
        accessToken: !jwt ? null : `jwt:${Hash.shorten(jwt, 4)} (${jwt.length})`,
        props: { ...props, code: props.code?.slice(0, 30) },
        deno,
      };
      return (
        <Dev.Object
          name={name}
          data={Delete.undefined(data)}
          expand={{ level: 1, paths: ['$', '$.tmp'] }}
          fontSize={11}
        />
      );
    });
  });
});
