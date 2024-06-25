import minimist from 'minimist';

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
  parse(input: string | string[] = []) {
    return minimist(Args.asArray(input));
  },

  /**
   * Ensure command-line arguments are an array.
   */
  asArray(input: string | string[] = []) {
    return Array.isArray(input) ? input : input.split(' ');
  },
} as const;
