#!/usr/bin/env ts-node
import * as pc from 'picocolors';
import { Vercel } from 'cloud.vercel';
import { Filesystem, NodeFs } from 'sys.fs.node';
import { rx, Time } from 'sys.util';

import { t } from '../src/common';
import { ContentBundle, ContentLog } from 'sys.pkg';
import { Text } from 'sys.text/node';

import { Pkg } from '../src/index.pkg.mjs';

import { pushToVercel } from './deploy.vercel.mjs';

// const token = process.env.VERCEL_TEST_TOKEN || ''; // Secure API token (secret).
const bus = rx.bus();

const dir = async (dir: string) => {
  const store = await Filesystem.client(NodeFs.resolve(dir), { bus });
  return store.fs;
};

const logdir = await dir('./dist.deploy/.log/');
// const publicdir = await dir('./public/');
const targetdir = await dir('./dist.deploy/');

const bundler = await ContentBundle({
  Text,
  sources: {
    app: await dir('./dist/web'),
    src: await dir('./src/'),
    content: await dir('./src.content'),
    log: logdir,
  },
});

const bundle = await bundler.write.bundle(targetdir);

console.log('r', bundle);

const version = Pkg.version;
const fs = await dir('');
// await pushToVercel({ version, fs, source: 'dist/web', bus });

const logger = ContentLog.log(logdir);
logger.write({ bundle: bundle.toObject() });
