import { NodeFs } from '../src/index.mjs';

const root = NodeFs.resolve('./src');
const pattern = NodeFs.join(root, '**/*.mts');
const src = (await NodeFs.glob(pattern)).map((p) => p.substring(root.length));

console.log('glob:', src);
