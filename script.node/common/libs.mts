/**
 * @vendor
 */
import { splitEvery } from 'ramda';
export const R = { splitEvery } as const;

import { execa } from 'execa';
import { glob } from 'glob';
import minimist from 'minimist';
import ora from 'ora';
import pc from 'picocolors';
import filesize from 'pretty-bytes';
import { rimraf } from 'rimraf';
import semver from 'semver';

export { execa, filesize, glob, minimist, ora, pc, rimraf, semver };

/**
 * @system
 */
export { Sort } from '../../code/system/sys.util/src/Sort/Sort';
export { Time } from '../../code/system/sys.util/src/Time';

/**
 * @local
 */
export { Builder, Count, LogTable, fs } from '../../code/compiler/builder';
