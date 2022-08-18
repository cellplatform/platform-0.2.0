#!/usr/bin/env ts-node
import { Builder, minimist } from './common/index.mjs';

const dir = process.cwd();
const argv = minimist(process.argv.slice(2));

console.log('clean | argv', argv); // TEMP 🐷

await Builder.clean(dir);
