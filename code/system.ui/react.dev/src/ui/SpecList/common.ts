import { DEFAULTS as BASE, type t } from '../common';

export * from '../common';
export * from './common.Calc';

/**
 * Constants
 */
const badge: t.SpecListBadge = {
  image: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/ci.node.yml/badge.svg',
  href: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/ci.node.yml',
} as const;

export const DEFAULTS = {
  badge,
  qs: BASE.qs,
} as const;
