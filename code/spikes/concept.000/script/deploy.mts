#!/usr/bin/env ts-node

import { Filesystem, NodeFs } from 'sys.fs.node';
import { rx } from 'sys.util';
import { Pkg } from '../src/index.pkg.mjs';
import { pushToVercel } from './deploy.vercel.mjs';

const bus = rx.bus();
const dir = async (dir: string) => {
  const store = await Filesystem.client(NodeFs.resolve(dir), { bus });
  return store.fs;
};

const res = await pushToVercel({
  fs: await dir('dist'),
  source: 'web',
  version: Pkg.version,
  bus,
});
