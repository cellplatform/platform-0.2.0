import { Dev, Icons } from '../../test.ui';
import { Grid, type GridProps } from './-SPEC.Grid';
import { Storage } from './Storage';

import type { Web3Storage } from 'web3.storage';

type T = {
  props: GridProps;
  debug: {
    editApiKey?: string;
    spinning?: 'List' | 'Write';
  };
};
const initial: T = {
  props: {},
  debug: {},
};

/**
 * Spec
 */
const name = 'Sample';

export default Dev.describe(name, (e) => {
  type LocalStore = { apiKey?: string; list?: any[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:ext.driver.ipfs.w3s');
  const local = localstore.object({
    apiKey: undefined,
    list: undefined,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.list = local.list;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        return <Grid {...e.state.props} apiKey={local.apiKey} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    /**
     * https://github.com/web3-storage/web3.storage
     * https://web3.storage/docs/reference/js-client-library
     * https://web3.storage/docs/how-tos/retrieve/
     * https://web3.storage/account/
     */
    dev.section(['web3.storage', '(current)'], (dev) => {
      const getList = async (store?: Web3Storage) => {
        await state.change((d) => (d.debug.spinning = 'List'));
        const list = await Storage.list(store ?? (await Storage.import(local.apiKey)));
        await state.change((d) => {
          local.list = list;
          d.props.list = list;
          d.debug.spinning = undefined;
        });
      };

      dev.textbox((txt) => {
        const editValue = () => state.current.debug.editApiKey ?? '';
        const localValue = () => local.apiKey;
        const icon = () => {
          if (editValue()) return <Icons.Edit size={14} />;
          if (localValue()) return <Icons.Verified size={16} />;
          return;
        };
        txt
          .label((e) => 'api key')
          .value((e) => editValue())
          .placeholder(() =>
            local.apiKey
              ? 'stored locally (type "clear" to remove)'
              : 'enter key (see web3.storage account)',
          )
          .onChange((e) => e.change((d) => (d.debug.editApiKey = e.to.value)))
          .right((e) => icon())
          .onEnter((e) => {
            e.change((d) => {
              const value = d.debug.editApiKey ?? '';
              local.apiKey = value.toLowerCase() === 'clear' ? undefined : value;
              d.debug.editApiKey = undefined;
            });
          });
      });

      dev.hr(0, 20);

      dev.button((btn) => {
        btn
          .label(`list`)
          .enabled((e) => Boolean(local.apiKey))
          .spinner((e) => e.state.debug.spinning === 'List')
          .onClick(() => getList());
      });

      dev.hr(-1, 5);

      dev.button((btn) => {
        btn
          .label(`write`)
          .enabled((e) => Boolean(local.apiKey))
          .spinner((e) => e.state.debug.spinning === 'Write')

          .onClick(async (e) => {
            await state.change((d) => (d.debug.spinning = 'Write'));
            const store = await Storage.import(local.apiKey);
            await Storage.put(
              store,
              'my-dir',
              ['hello-1', 'foo/hello-1.txt'],
              ['hello-2', 'foo/hello-2.txt'],
            );
            await state.change((d) => (d.debug.spinning = 'Write'));
            await getList();
          });
      });
    });

    dev.hr(0, 50);
    dev.hr(5, 20);

    /**
     * NOTE:
     *    This is the "new" client, which is still in development.
     *    https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#basic-usage
     */
    dev.section(['w3up-client', '(pre-release)'], (dev) => {
      dev.TODO();

      dev.button((btn) => {
        const github = 'https://github.com/web3-storage/w3up/tree/main/packages/w3up-client';
        btn
          .label(`lib`)
          .right((e) => (
            <a href={github} target={'_blank'}>
              {'github'}
            </a>
          ))
          .enabled((e) => true)
          .onClick(async (e) => {
            const { create } = await import('@web3-storage/w3up-client');
            const client = await create();
            console.log('client', client);
          });
      });
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
