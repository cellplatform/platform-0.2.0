import { Hash, css, Dev, type t } from '../../test.ui';

type T = {
  running?: boolean;
  url?: string;
};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const url = e.state.url;

        const styles = {
          base: css({
            padding: 10,
            backgroundImage: url ? `url(${url})` : undefined,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }),
        };

        return <div {...styles.base}>{`🐷 ${name}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO();

    dev.hr(5, 20);

    const env = (key: string): string => {
      const obj = (import.meta as any).env;
      const value = obj[key];
      if (!value) throw new Error(`Failed to retrieve '${key}'. Ensure a .env.local file exists.`);
      return value;
    };

    /**
     * https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#basic-usage
     */
    dev.button('lib: w3up-client', async (e) => {
      const { create } = await import('@web3-storage/w3up-client');
      const client = await create();
      console.log('client', client);
    });

    dev.hr(-1, 5);

    /**
     * https://github.com/web3-storage/web3.storage
     * https://web3.storage/docs/reference/js-client-library
     * https://web3.storage/docs/how-tos/retrieve/
     * https://web3.storage/account/
     */
    dev.button((btn) => {
      btn
        .label(`lib: web3.storage`)
        .spinner((e) => Boolean(e.state.running))
        .onClick((e) => runSample());
    });

    const runSample = async () => {
      const { Web3Storage, getFilesFromPath } = await import('web3.storage');

      await state.change((d) => (d.running = true));

      const m = await import('web3.storage');
      // m.

      const token = env('VITE_WEB3_TOKEN');
      const storage = new Web3Storage({ token });

      const Url = {
        from: (cid: string, filename: string) => `https://${cid}.ipfs.w3s.link/${filename}`,
      };

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

      const put = async (text: string, path: string) => {
        const file = toFile(text, path);
        await storage.put([file], { name: path });
      };

      // await put('hello-1', 'foo/hello-1.txt');
      // await put('hello-2', 'foo/hello-2.txt');

      await printList();
      await state.change((d) => (d.running = false));
    };
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
