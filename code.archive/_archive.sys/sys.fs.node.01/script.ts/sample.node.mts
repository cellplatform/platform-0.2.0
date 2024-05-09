import { NodeFs } from '../src/index.mjs';
import { pc } from '../../sys.util.node/src/index.mjs';

const root = NodeFs.resolve('./src');
const pattern = NodeFs.join(root, '**/*.mts');
const src = (await NodeFs.glob(pattern)).map((p) => p.substring(root.length));

console.log(`💦`);
console.log(pc.cyan(`sys.fs.${pc.white('node')}`), pc.gray(`(sample)`));
console.log();
console.log('pattern', pc.gray(pattern));
console.log(
  'glob:',
  src.filter((path) => path.startsWith('/Fs.')),
);
