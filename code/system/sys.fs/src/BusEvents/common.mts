export * from '../common/index.mjs';
export { Path } from '../Path/index.mjs';

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
