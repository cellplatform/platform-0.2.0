#!/usr/bin/env ts-node
import { Builder } from '../code/builder/Builder.mjs';

const argv = process.argv.slice(2);
const dir = argv[0] ?? '';

if (!dir) {
  console.error(`FAIL(Build): path to module directory required.`);
  process.exit(1);
}

/**
 * Run
 */
await Builder.build(dir);
