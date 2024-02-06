import { DEFAULTS as BASE, DevBase, type t } from '../common';

export * from '../common';
export * from './common.Filter';
export const SpecList = DevBase.SpecList;

const badge: t.SpecListBadge = {
  image: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/ci.node.yml/badge.svg',
  href: 'https://github.com/cellplatform/platform-0.2.0/actions/workflows/ci.node.yml',
} as const;

/**
 * Constants
 */
export const DEFAULTS = {
  badge,
  focusOnReady: true,
  qs: BASE.qs,
} as const;
