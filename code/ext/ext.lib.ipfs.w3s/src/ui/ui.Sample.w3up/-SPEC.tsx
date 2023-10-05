import { Dev, type t } from '../../test.ui';
import { create } from '@web3-storage/w3up-client';
import { Wrangle } from '../ui.Sample.old.w3storage';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.w3up';

export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        return <div style={{ padding: 8 }}>{`🐷 ${'Sample'}`}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    /**
     * NOTE:
     *    This is the "new" client, which is still in development.
     *    - https://web3-storage.github.io/w3up-client/
     *    - https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#basic-usage
     */
    dev.section('debug', (dev) => {
      dev.button((btn) => {
        const github = 'https://github.com/web3-storage/w3up/tree/main/packages/w3up-client';
        btn
          .label(`basic usage`)
          .right((e) => (
            <a href={github} target={'_blank'}>
              {'github (pre-release)'}
            </a>
          ))
          .enabled((e) => true)
          .onClick(sampleBasicUsage);
      });
    });

    dev.hr(0, 5);
    dev.TODO();
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

/**
 * Sample
 * - https://web3-storage.github.io/w3up-client/#basic-usage
 * - https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#basic-usage
 */
async function sampleBasicUsage() {
  const client = await create();
  console.log('client', client);

  /**
   * Create and register space.
   */
  const name = 'my-sample-space';
  if (client.spaces().length === 0) {
    await client.createSpace(name);
  }

  const space = client.spaces().find((s) => s.name() === name)!;
  await client.setCurrentSpace(space.did());

  if (!space.registered()) {
    try {
      const email = 'phil@cockfield.net';
      console.info(`check for email sent to: ${email}`);
      await client.registerSpace(email, { provider: 'did:web:web3.storage' });
    } catch (err) {
      console.error('registration failed: ', err);
    }
  }

  /**
   * Upload file.
   */
  const binary = new TextEncoder().encode('boom');
  const files = [
    new File(['# Hello World 👋'], 'README.md'),
    new File(['console.info("🌳")'], 'src/main.ts'),
    new File([binary], 'data/binary.dat'),
  ];

  console.log('files', files);
  const directoryCid = await client.uploadDirectory(files);

  console.log('directoryCid', directoryCid);
  console.log('directoryCid', directoryCid.toString());
  const cid = directoryCid.toString();

  // bafybeiaqylpxvbovgpw6owvsgba4grfdv4hlpekxu7wwfwqvwpu4kduj7y
  const url = Wrangle.Url.cid(cid);
  console.log('url', url);

  console.log('directoryCid.link', directoryCid.link());

  const list = await client.capability.store.list();
  console.log('list', list);
}
