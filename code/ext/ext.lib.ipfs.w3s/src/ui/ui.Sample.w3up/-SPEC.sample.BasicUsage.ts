import { create } from '@web3-storage/w3up-client';
import { Wrangle } from '../ui.Sample.old.w3storage';

/**
 * Sample
 * - https://web3-storage.github.io/w3up-client/#basic-usage
 * - https://github.com/web3-storage/w3up/tree/main/packages/w3up-client#basic-usage
 */
export async function sampleBasicUsage() {
  const client = await create();

  const email = 'philcockfield@gmail.com';
  const name = 'my-foo';

  console.log('email:', email);
  console.log('space:', name);
  console.log('-------------------------------------------');

  /**
   * Create and register space.
   */
  const findSpace = (name: string) => client.spaces().find((s) => s.name() === name)!;
  if (!findSpace(name)) await client.createSpace(name);

  const space = findSpace(name);
  await client.setCurrentSpace(space.did());

  // client.capability
  // console.info(`check for email sent to: ${email}`);
  // await client.authorize(email);
  // return;

  console.log('space', space);
  console.log('space.registered()', space.registered());
  if (!space.registered()) {
    try {
      await client.registerSpace(email, { provider: 'did:web:web3.storage' });
    } catch (err) {
      console.error('registration failed: ', err);
    }
  }

  /**
   * Upload file.
   */
  //   const binary = new TextEncoder().encode('boom');
  //   const files = [
  //     new File(['# Hello World 👋'], 'README.md'),
  //     new File(['console.info("🌳")'], 'src/main.ts'),
  //     new File([binary], 'data/binary.dat'),
  //   ];
  //
  //   console.log('files', files);
  //   const directoryCid = await client.uploadDirectory(files);
  //
  //   console.log('directoryCid', directoryCid);
  //   console.log('directoryCid', directoryCid.toString());
  //   const cid = directoryCid.toString();

  // const url = Wrangle.Url.cid(cid);
  // const url2 = Wrangle.Url.name(cid, 'README.md');
  // console.log('url', url);
  // console.log('directoryCid.link', directoryCid.link());

  // console.log('url2', url2);

  const storeList = await client.capability.store.list();
  // const uploadList = await client.capability.upload.list();

  console.log('storeList', storeList);
  // console.log('uploadList', uploadList);

  storeList.results.forEach((item) => {
    // console.log('item.link.toString();', item.link.toString());
    const url = Wrangle.Url.cid(item.link.toString());
    console.log('url', url);
  });
}
