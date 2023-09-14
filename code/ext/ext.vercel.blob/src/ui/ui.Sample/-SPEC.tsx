import { Dev, Filesize, PropList, type t } from '../../test.ui';
import { SpecUpload, type SpecUploadProps } from './-SPEC.DropTarget';

import { type ListBlobResult } from '@vercel/blob';

type T = {
  list: ListBlobResult['blobs'];
  props: SpecUploadProps;
  debug: { listSpinning?: boolean; local?: boolean };
};
const initial: T = {
  list: [],
  props: {},
  debug: {},
};

/**
 * https://vercel.com/docs/storage/vercel-blob
 */
const name = 'Sample';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<T['debug'], 'local'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.vercel.blob.Sample');
  const local = localstore.object({
    local: location.hostname === 'localhost',
  });

  const Endpoint = {
    base(state: T) {
      return state.debug.local
        ? 'https://meet-frog-naturally.ngrok-free.app'
        : 'https://blob.dev.db.team';
    },
    read(state: T) {
      return `${Endpoint.base(state)}/api/read`;
    },
  };

  const fetchList = async (state: t.DevCtxState<T>) => {
    await state.change((d) => (d.debug.listSpinning = true));

    const url = Endpoint.read(state.current);
    const res = await fetch(url);

    console.log('blob/fetch → url:', url);

    await state.change(async (d) => {
      d.debug.listSpinning = false;
      d.list = await res.json();
    });
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.debug.local = local.local;
    });
    // fetchList(state);

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <SpecUpload {...e.state.props} onUploaded={() => fetchList(state)} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.button('tmp', async (e) => {
      const { usePrivy, PrivyProvider, Chain, Wallet, Balance } = await import(
        'ext.driver.auth.privy'
      );

      const { Info } = await import('ext.driver.automerge');

      console.group('🌳 ');
      console.log('usePrivy', usePrivy);
      console.log('PrivyProvider', PrivyProvider);
      console.groupEnd();

      console.group('🌳 ');
      console.log('Chain', Chain);
      console.log('Wallet', Wallet);
      console.log('Balance', Balance);
      console.log('Info', Info);
      console.groupEnd();

      const el = (
        <PrivyProvider appId="hello">
          <div>foo</div>
        </PrivyProvider>
      );

      console.log('el', el);
      // const { Specs } = await import('ext.driver.auth.privy/specs');
      // console.log('Specs', Specs);

      // const { init } = await import('ext.driver.auth.privy.2');
      // const res = await init(PrivyProvider);
      // console.log('res', res);
      // // import { Auth } from 'ext.driver.auth.privy';
      // console.log('Auth', Auth);

      // console.log('load', load);

      // const m = Specs['ext.driver.auth.privy.ui.Info'];
      // const res = await m();

      // console.log('Foo', Foo);
      // import { Auth } from 'ext.driver.auth.privy';
      // console.log('Auth', Auth);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.local);
        btn
          .label((e) => (value(e.state) ? `local (via ngrok)` : 'local'))
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.local = Dev.toggle(d.debug, 'local'))));
      });

      dev.hr(-1, 5);

      dev.button((btn) => {
        btn
          .label(`refresh list`)
          .spinner((e) => Boolean(e.state.debug.listSpinning))
          .enabled((e) => true)
          .onClick((e) => {
            fetchList(state);
          });
      });
    });

    dev.hr(5, 20);

    function downloadURL(url: string, filename: string) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    dev.row((e) => {
      const items: t.PropListItem[] = e.state.list.map((blob) => {
        return {
          label: blob.pathname,
          value: {
            data: Filesize(blob.size),
            onClick: () => downloadURL(blob.url, blob.pathname),
          },
        };
      });

      return <PropList items={items} />;
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
