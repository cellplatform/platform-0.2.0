import { t } from './common.mjs';

type O = Record<string, unknown>;

type SKIP = 'skip';
type CONTINUE = true;
type EXIT = false;
type ContinuationDirectives = { SKIP: SKIP; CONTINUE: CONTINUE; EXIT: EXIT };
type ContinuationResponse = SKIP | CONTINUE | EXIT;

/**
 * MARKDOWN
 */
export type MutateMdast = {
  /**
   * Basic reveal of the root tree.
   *    Use this with standard unified.js tools
   *    (like 'unist-util-visit') like you would in a plugin.
   */
  tree: MutateMdastTree;

  /**
   * TODO 🐷
   * - visit
   */
};

export type MutateMdastTree = (fn: MutateMdastTreeFn) => void;
export type MutateMdastTreeFn = (tree: t.MdastRoot) => void;

/**
 * HTML.
 */
export type MutateHast = {
  /**
   * Basic reveal of the root tree.
   *    Use this with standard unified.js tools
   *    (like 'unist-util-visit') like you would in a plugin.
   */
  tree: MutateHastTree;

  /**
   * Helper for running a 'unist-util-visit' across the HTML tree
   * with a modified set of helper tools.
   */
  visit: MutateHastVisitor;
};

export type MutateHastTree = (fn: MutateHastTreeFn) => void;
export type MutateHastTreeFn = (tree: t.HastRoot) => void;

export type MutateHastVisitor = (fn: MutateHastVisitorFn) => void;
export type MutateHastVisitorFn = (e: MutateHastVisitorArgs) => ContinuationResponse | any;
export type MutateHastVisitorArgs = {
  node: t.HastNode;
  index: number;
  parent: t.HastRoot | t.HastElement | null;
  data<T extends O>(): T;
  hProperties<T extends O>(): T;
} & ContinuationDirectives;
