#!/usr/bin/env ts-node
import { Builder } from './common/index.mjs';

const dir = process.cwd();
const argv = process.argv.slice(2);

console.log('clean | argv', argv); // TEMP 🐷

await Builder.clean(dir);
