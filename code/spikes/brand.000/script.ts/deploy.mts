#!/usr/bin/env ts-node
import { Filesystem, NodeFs } from 'sys.fs.node';
import { Content } from 'sys.pkg';
import { Text } from 'sys.text/node';
import { rx } from 'sys.util';

import { Pkg } from '../src/index.pkg.mjs';
import { pushToVercel } from './deploy.vercel.mjs';

const bus = rx.bus();

const dir = async (dir: string) => {
  const store = await Filesystem.client(NodeFs.resolve(dir), { bus });
  return store.fs;
};

const logdir = await dir('./dist.deploy/.log/');
const targetdir = await dir('./dist.deploy/');

const bundler = await Content.bundler({
  Text,
  sources: {
    app: await dir('./dist/web'),
    src: await dir('./src/'),
    data: await dir('./src.data'),
    log: logdir,
  },
});

const version = Pkg.version;
const bundle = await bundler.write.bundle(targetdir);
const deployment = await pushToVercel({
  version,
  fs: bundle.fs,
  source: bundle.dir.app,
});

const logger = Content.logger(logdir);
logger.write({
  bundle: bundle.toObject(),
  deployment,
});
