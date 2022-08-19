#!/usr/bin/env ts-node
import { Builder, minimist } from './common/index.mjs';

const dir = process.cwd();
const argv = minimist(process.argv.slice(2));
const { watch, run, ui, coverage, silent } = argv;

Builder.test(dir, { watch, run, ui, coverage, silent });
