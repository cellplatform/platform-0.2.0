import { Builder, minimist } from './common';

const dir = process.cwd();
const argv = minimist(process.argv.slice(2));

await Builder.clean(dir);
