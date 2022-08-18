#!/usr/bin/env ts-node
import { Builder, minimist } from './common/index.mjs';

const dir = process.cwd();
const argv = minimist(process.argv.slice(2));
const { watch, ui, coverage } = argv;

Builder.test(dir, { watch, ui, coverage });
