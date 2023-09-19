import { Dev, Icons, css } from '../../test.ui';
import type { Web3Storage, Upload } from 'web3.storage';
import { Grid, type GridProps } from './-SPEC.Grid';
import { Wrangle } from './Wrangle';

type T = {
  props: GridProps;
  running__TMP?: boolean;
  debug: {
    editApiKey?: string;
    spinning?: 'List';
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
        return <Grid {...e.state.props} />;
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
      const Storage = {
        async import() {
          const { Web3Storage } = await import('web3.storage');
          const token = local.apiKey ?? '';
          return new Web3Storage({ token });
        },

        async list(storage: Web3Storage) {
          const res: Upload[] = [];
          const list = storage.list();
          for await (const item of list) res.push(item);
          return res;
        },
      } as const;

      const Url = {
        from(cid: string, name: string) {
          return `https://${cid}.ipfs.w3s.link/${name}`;
        },
      } as const;

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
          .label(`sample`)
          .spinner((e) => Boolean(e.state.running__TMP))
          .onClick((e) => runSample());
      });

      const runSample = async () => {
        const { Web3Storage, getFilesFromPath } = await import('web3.storage');

        await state.change((d) => (d.running__TMP = true));
        const m = await import('web3.storage');

        const token = local.apiKey ?? '';
        const storage = new Web3Storage({ token });

        const printList = async () => {
          const uploads = [];
          const list = storage.list();
          for await (const item of list) {
            uploads.push(item);
          }
          uploads.forEach((item) => {
            const url = Url.from(item.cid, item.name);
            console.log('url', url);
          });
        };

        const toFile = (text: string, path: string) => {
          const binary = new TextEncoder().encode(text);
          const file = new File([binary], path, { type: 'text/plain' });
          return file;
        };

        const put = async (dir: string, ...files: [string, string][]) => {
          const list = files.map(([text, path]) => toFile(text, path)); // const file = ;
          await storage.put(list, { name: dir });
        };

        // await put('hello-1', 'foo/hello-1.txt');
        // await put('hello-2', 'foo/hello-2.txt');

        await put('my-dir', ['hello-1', 'foo/hello-1.txt'], ['hello-2', 'foo/hello-2.txt']);

        await printList();
        await state.change((d) => (d.running__TMP = false));
      };

      dev.button((btn) => {
        btn
          .label(`list`)
          .enabled((e) => Boolean(local.apiKey))
          .spinner((e) => e.state.debug.spinning === 'List')
          .onClick(async (e) => {
            await e.change((d) => (d.debug.spinning = 'List'));
            const storage = await Storage.import();
            const list = await Storage.list(storage);
            await e.change((d) => {
              local.list = list;
              d.props.list = list;
              d.debug.spinning = undefined;
            });
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
      // dev.hr(0, 5);

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
