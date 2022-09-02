import { Filesystem } from '../index.mjs';
import { Json, rx } from '../common/index.mjs';

/**
 * Sample: Base Driver (DB)
 */
console.log('Filesystem', Filesystem);

const id = 'fs.dev';
const db = await Filesystem.IndexedDb({ id });
const { driver, indexer } = db;
console.log('db', db);

const json = Json.stringify({ foo: 123 });
const data = new TextEncoder().encode(json);

const uri = 'path:foo/bar.json';
await db.driver.write(uri, data);

const driverRead = new TextDecoder().decode((await db.driver.read(uri)).file?.data);
console.log('read (driver):', typeof driverRead, driverRead);

/**
 * Sample: Bus/Controller
 */
const bus = rx.bus();
const controller = Filesystem.BusController({ id, bus, driver, indexer });

const fs = controller.fs();
const fsRead = await fs.json.read(uri);
console.log('read (fs):', fsRead);
