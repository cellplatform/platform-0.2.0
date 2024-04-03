import { Value } from './libs';

/**
 * Generate a random port.
 */
export const randomPort = () => {
  const random = (min = 0, max = 9) => Value.random(min, max);
  return Value.toNumber(`${random(6, 9)}${random()}${random()}${random()}`);
};
