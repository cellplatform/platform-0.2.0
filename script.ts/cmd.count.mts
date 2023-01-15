#!/usr/bin/env ts-node
import { Count, fs } from './common/index.mjs';

const base = fs.resolve('.');
const system = await Count.modules(fs.join(base, 'code/system'));
const systemui = await Count.modules(fs.join(base, 'code/system.ui'));

Count.log([...system, ...systemui], { base });
