import type { t } from '../common';

type O = Record<string, unknown>;

/**
 * A generic splicer function to apply a
 * detailed "unit of change" to a string.
 */
export type Splice = <T extends O>(
  doc: T,
  path: t.ObjectPath,
  index: t.Index,
  delCount: number,
  newText?: string,
) => void;

/**
 * A unit of difference within a string of text.
 */
export type TextDiff = {
  readonly index: number;
  readonly delCount: number;
  readonly newText?: string;
};
