import { clone, equals, uniq, mergeDeepRight } from 'ramda';
export const R = { clone, equals, uniq, mergeDeepRight } as const;

import { execa } from 'execa';
import pc from 'picocolors';
import { rimraf } from 'rimraf';
import semver from 'semver';
import prettybytes from 'pretty-bytes';

/**
 * @vendor
 */
export { pc, execa, rimraf, semver, prettybytes };
