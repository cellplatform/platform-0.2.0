import { DEFAULTS as DEFAULTS_BASE, type t } from '../common';

export * from '../common';
export * from './common.Calc';

/**
 * Constants
 */
const badge: t.ModuleListBadge = {
  image: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/ci.node.yml/badge.svg',
  href: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/ci.node.yml',
} as const;

export const DEFAULTS = {
  qs: DEFAULTS_BASE.qs,
  badge,
  list: { minWidth: 550 },
} as const;
