import { Value } from '../common';
import { Link } from './Helpers.Link';
import { Theme } from './Helpers.Theme';

/**
 * Simple helpers useful when workling with the [DevTools].
 */
export const Helpers = {
  Link,
  Theme,
  toggle: Value.toggle,
} as const;
