import type { t } from '../common';

export * from './Color.const';
export * from './Color.format';
export * from './Color.theme';

/**
 * A curried function that returns a "red/ruby" color shade based on the given debug flag.
 */
export function debug(debug?: boolean) {
  return (opacity: t.Percent = 0.3) => (debug ? `rgba(255, 0, 0, ${opacity})` : undefined);
}
