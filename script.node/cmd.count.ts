import { Count, fs } from './common/index.mjs';

const base = fs.resolve('.');
const system = await Count.modules(fs.join(base, 'code/system'));
const systemui = await Count.modules(fs.join(base, 'code/system.ui'));
const extlib = await Count.modules(fs.join(base, 'code/ext'));

Count.log([...system, ...systemui, ...extlib], { base });
