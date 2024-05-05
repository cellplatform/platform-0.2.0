import { Builder, minimist } from './common/index.mjs';

const dir = process.cwd();
const argv = minimist(process.argv.slice(2));

await Builder.clean(dir);
