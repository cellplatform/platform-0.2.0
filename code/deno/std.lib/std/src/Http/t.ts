import type { t } from '../common/mod.ts';

export type HttpUrl = {
  readonly base: string;
  join(...parts: string[]): string;
  toString(): string;
};

export type HttpClient = {};
