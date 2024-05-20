import { Count, fs } from './common';

const base = fs.resolve('.');
const system = await Count.modules(fs.join(base, 'code/sys'));
const systemui = await Count.modules(fs.join(base, 'code/sys.ui'));
const extlib = await Count.modules(fs.join(base, 'code/ext'));

Count.log([...system, ...systemui, ...extlib], { base });
