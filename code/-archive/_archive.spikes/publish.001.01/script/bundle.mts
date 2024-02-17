import { Filesystem, NodeFs } from 'sys.fs.node';
import { Content } from 'sys.pkg';
import { Text } from 'sys.text/node';
import { rx } from 'sys.util';

import { Pkg } from '../src/index.pkg.mjs';

const bus = rx.bus();

const dir = async (dir: string) => {
  const store = await Filesystem.client(NodeFs.resolve(dir), { bus });
  return store.fs;
};

const publicdir = await dir('./public/data');
const targetdir = await dir('./dist.cell/');
const bundler = await Content.bundler({
  Text,
  throwError: true,
  sources: {
    app: await dir('./dist/web'),
    src: await dir('./src/'),
    data: await dir('../../../../../org.team-db/tdb.working/project.undp/data'),
    log: await dir('./dist.cell/.log/'),
  },
});

const version = Pkg.version;
const bundle = await bundler.write.bundle(targetdir, version);
await bundler.write.data(publicdir, version); // Store the data in "/public" (for local dev usage)

console.log('-------------------------------------------');
console.log('bundle:', bundle.toObject());
console.log();

export { bus, bundle };
