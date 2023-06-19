import { Dev, Filesize, Filesystem, Time, expect, rx } from '../common';

/**
 * TODO 🐷
 * - run complete spec set
 */

export default Dev.describe('Health Check', async (e) => {
  const id = 'fs.dev';
  const db = await Filesystem.Driver.IndexedDb({ id });
  const { driver } = db;

  e.it(`Driver: ${Filesystem.Driver.kind}`, async (e) => {
    const now = Time.now.timestamp;
    const json = JSON.stringify({ foo: 123, now });
    const data = new TextEncoder().encode(json);

    const uri = 'path:.dev/health-check/bar.json';
    await driver.io.write(uri, data);

    const res = (await driver.io.read(uri)).file?.data;
    console.log('res', res);
    // const driverRead = new TextDecoder().decode((await driver.io.read(uri)).file?.data);
    const driverRead = new TextDecoder().decode(res);
    console.log('driver/read:', typeof driverRead, driverRead);
    console.log('-------------------------------------------');

    expect(data).to.eql(res);
  });

  e.it('Bus/Controller', async (e) => {
    const bus = rx.bus();
    const controller = Filesystem.Bus.Controller({ id, bus, driver });

    bus.$.subscribe((e) => {
      console.log('💦', e);
    });

    const fs = controller.fs('.dev/health-check');
    const uri = 'path:.dev/health-check/bar.json';
    const fsRead = await fs.json.read(uri);
    console.log('read (fs):', fsRead);

    console.log('-------------------------------------------');
    console.log('manifest', await fs.manifest());
    console.log('info', await fs.info('foo'));

    // Read and write some data.
    const obj = { foo: 123 };
    const json = JSON.stringify(obj);
    const data = new TextEncoder().encode(json);

    const path = 'foo/file.json';
    const res1 = await fs.write(path, data);

    expect(res1.bytes).to.equal(11);
    expect(res1.hash).to.match(/^sha256\-/);

    const res2 = await fs.read(path);
    const readText = new TextDecoder().decode(res2);
    const readObject = JSON.parse(readText);

    expect(res2?.byteLength).to.eql(11);
    expect(readText).to.eql(json);
    expect(readObject).to.eql(obj);

    const m = await controller.fs().manifest();
    m.files.forEach((file) => {
      console.info(`> file: ${file.path}, ${Filesize(file.bytes)} `);
    });
  });
});
