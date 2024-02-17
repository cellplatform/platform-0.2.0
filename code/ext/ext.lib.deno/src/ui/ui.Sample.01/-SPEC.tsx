import { Delete, Dev, Pkg, slug } from '../../test.ui';
import { Info } from '../ui.Info';

import { SAMPLE } from './-SPEC.sample';
import { Http, type t } from './common';
import { Sample } from './ui';

type T = {
  props: t.SampleProps;
  debug: { forcePublicUrl?: boolean };
  tmp?: any;
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = 'Sample.01';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.SampleProps, 'code'> & T['debug'];
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  ('⚡️💦🐷🌳 🍌🧨🌼✨🧫 🐚👋🧠⚠️💥👁️ ↑↓←→');
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
      d.debug.forcePublicUrl = local.forcePublicUrl;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return (
          <Sample
            {...e.state.props}
            onChange={async (e) => {
              local.code = e.text;
              await state.change((d) => (d.props.code = e.text));
              // dev.redraw('debug');
            }}
            onCmdEnterKey={(e) => {
              console.info('⚡️ onCmdEnterKey', e);
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);

    dev.row((e) => {
      return (
        <Info
          //
          fields={['Component']}
          data={{ component: { label: 'Management Interface', name: 'Deno Subhosting' } }}
        />
      );
    });

    dev.hr(5, 20);

    link
      .title('References')
      .ns('docs: deno → subhosting', 'https://docs.deno.com/subhosting/manual')
      .hr()
      .ns('tutorial (video)', 'https://github.com/denoland/subhosting_ide_starter')
      .ns('tutorial (sample repo)', 'https://github.com/denoland/subhosting_ide_starter');

    dev.hr(5, 20);

    dev.section('Actions', (dev) => {
      dev.button('set sample: "code"', (e) => {
        e.change((d) => (local.code = d.props.code = SAMPLE.code));
      });

      dev.hr(-1, 5);

      const getHttp = () => {
        const forcePublic = state.current.debug.forcePublicUrl;
        const fetch = Http.fetcher({ forcePublic });
        // return Http.Api.http({ forcePublic });
        return Http.methods(fetch);
      };

      dev.button('💦 GET projects', async (e) => {
        // https://docs.deno.com/subhosting/manual
        const http = getHttp();
        const res1 = await http.get('deno/hosting');
        const res2 = await http.get('deno/hosting/projects');
        console.log('res1', res1.json);
        console.log('res2', res2.json);

        e.change((d) => (d.tmp = { info: res1.json, projects: res2.json }));
      });

      dev.button('💦 POST create project', async (e) => {
        // https://docs.deno.com/subhosting/manual
        const http = getHttp();
        const body = {
          name: `foo-${slug()}`,
          description: 'Sample project',
        };
        const res = await http.post('deno/hosting/projects', body);

        e.change((d) => (d.tmp = res.json));
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
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const { debug, props, tmp } = e.state;
      const forcePublic = debug.forcePublicUrl;
      const data = {
        origin: Http.origin({ forcePublic }),
        props,
        tmp,
      };
      return (
        <Dev.Object
          name={name}
          data={Delete.undefined(data)}
          expand={{ level: 1, paths: ['$', '$.tmp'] }}
        />
      );
    });
  });
});
