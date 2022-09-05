import { Filesystem } from '../index.mjs';
import { Json, rx } from '../common/index.mjs';

/**
 * Sample: Base Driver (DB)
 */
console.log('Filesystem', Filesystem);
console.log('-------------------------------------------');

const id = 'fs.dev';
const db = await Filesystem.driver.IndexedDb({ id });
const { driver, indexer } = db;
console.log('db', db);

const json = JSON.stringify({ foo: 123 });
const data = new TextEncoder().encode(json);

const uri = 'path:foo/bar.json';
await db.driver.write(uri, data);

const driverRead = new TextDecoder().decode((await db.driver.read(uri)).file?.data);
console.log('driver/read:', typeof driverRead, driverRead);
console.log('-------------------------------------------');

/**
 * Sample: Bus/Controller
 */
const bus = rx.bus();
const controller = Filesystem.driver.BusController({ id, bus, driver, indexer });

bus.$.subscribe((e) => {
  console.log('💦', e);
});

const fs = controller.fs();
const fsRead = await fs.json.read(uri);
console.log('read (fs):', fsRead);

console.log('-------------------------------------------');

const manifest = await fs.manifest();
console.log('manifest', manifest);
