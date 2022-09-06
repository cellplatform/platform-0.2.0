import { rx } from '../common/index.mjs';
import { Filesystem } from '../index.mjs';

/**
 * Sample: Base Driver (DB)
 */
console.log('Filesystem', Filesystem);
console.log('-------------------------------------------');

const id = 'fs.dev';
const db = await Filesystem.driver.IndexedDb({ id });
const { driver } = db;

console.log('db', db);

const json = JSON.stringify({ foo: 123 });
const data = new TextEncoder().encode(json);

const uri = 'path:foo/bar.json';
await driver.io.write(uri, data);

const driverRead = new TextDecoder().decode((await driver.io.read(uri)).file?.data);
console.log('driver/read:', typeof driverRead, driverRead);
console.log('-------------------------------------------');

/**
 * Sample: Bus/Controller
 */
const bus = rx.bus();
const controller = Filesystem.driver.BusController({ id, bus, driver });

bus.$.subscribe((e) => {
  console.log('💦', e);
});

const fs = controller.fs();
const fsRead = await fs.json.read(uri);
console.log('read (fs):', fsRead);

console.log('-------------------------------------------');

const manifest = await fs.manifest();
console.log('manifest', manifest);
