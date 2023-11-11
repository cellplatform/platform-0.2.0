export * from '../ui/common';

export const DEFAULTS = {
  sys: { dbname: '.index' },
} as const;

export const NAME = {
  STORE: { repos: 'repos' },
  INDEX: { repos: 'repos' },
} as const;
