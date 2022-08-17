#!/usr/bin/env ts-node
import { Builder } from '../code/builder/Builder.mjs';

const dir = process.cwd();
const argv = process.argv.slice(2);

console.log('argv', argv);

await Builder.clean(dir);
