import minimist from 'minimist';
import { type t } from '../common';

type TArgv = string | string[];

/**
 * Standard posix style command line argument parsing.
 * References:
 *  - https://jsr.io/@std/flags
 *  - https://jsr.io/@std/cli/doc/parse-args/~/parseArgs
 *  - https://github.com/minimistjs/minimist
 */
export const Args = {
  /**
   * Parse arguments into strongly typed object.
   */
  parse(input: TArgv = []): t.ParsedArgs {
    const res = minimist(Args.argv(input));
    return res;
  },

  /**
   * Ensure command-line arguments are an array.
   */
  argv(input: TArgv = []) {
    return Array.isArray(input) ? input : input.split(' ');
  },

  /**
   * Retrieves the "positional arguments" from the given input
   * removing empty spaces.
   */
  positional(input: TArgv | t.ParsedArgs = [], options: { raw?: boolean } = {}) {
    const parsed = Array.isArray(input) || typeof input === 'string' ? Args.parse(input) : input;
    if (options.raw) return parsed._;
    return parsed._.map((part) => part.trim()).filter((e) => !!e);
  },
} as const;
