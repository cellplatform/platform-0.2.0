export * from '../common';
export { Path } from '../Path';

/**
 * Parameter wrangling helpers
 */
export const Wrangle = {
  timeout(defaultTimeout?: number) {
    return (options: { timeout?: number } = {}) => {
      return options.timeout ?? defaultTimeout ?? 20 * 1000;
    };
  },
};
