/**
 * @vendor
 */
import { splitEvery } from 'ramda';
export const R = { splitEvery } as const;

import ora from 'ora';
import pc from 'picocolors';
import { rimraf } from 'rimraf';
import { glob } from 'glob';
import { execa } from 'execa';
import minimist from 'minimist';
import filesize from 'pretty-bytes';
import semver from 'semver';

export { ora, pc, rimraf, execa, minimist, glob, filesize, semver };

/**
 * @system
 */
export { Sort } from '../../code/system/sys.util/src/Sort/Sort.mjs';
export { Time } from '../../code/system/sys.util/src/Time/Time.mjs';
export { LogTable } from '../../code/system/sys.util.node/src/index.mjs';

/**
 * @local
 */
export { fs, Builder, Count } from '../../code/compiler/builder.node/index.mjs';
