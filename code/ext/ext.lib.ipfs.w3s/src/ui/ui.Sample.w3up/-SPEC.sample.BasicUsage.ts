import { create } from '@web3-storage/w3up-client';
import { Wrangle } from '../ui.Sample.old.w3storage';

/**
 * Sample
 * - https://web3-storage.github.io/w3up-client/#basic-usage
 * - https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#basic-usage
 */
export async function sampleBasicUsage() {
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
