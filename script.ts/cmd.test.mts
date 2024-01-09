import { Builder, minimist } from './common/index.mjs';

const dir = process.cwd();
const argv = minimist(process.argv.slice(2));
const { watch, run, ui, coverage, silent, reporter } = argv;
const filter = argv._;

Builder.test(dir, { filter, watch, run, ui, coverage, silent, reporter });
