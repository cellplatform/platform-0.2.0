import { type t } from './common.mjs';

type O = Record<string, unknown>;

type SKIP = 'skip';
type CONTINUE = true;
type EXIT = false;
type ContinuationDirectives = { SKIP: SKIP; CONTINUE: CONTINUE; EXIT: EXIT };
type ContinuationResponse = SKIP | CONTINUE | EXIT;

/**
 * 💦
 * MARKDOWN
 */
export type MutateMdast = {
  /**
   * Basic reveal of the root tree.
   *    Use this with standard unified.js tools
   *    (like 'unist-util-visit') like you would within a plugin.
   */
  tree: MutateMdastTree;

  /**
   * Helper for running a 'unist-util-visit' across the MARKDOWN tree
   * with a set of helper tools passed in as arguments.
   */
  visit: MutateMdastVisitor;
};

export type MutateMdastTree = (fn: MutateMdastTreeFn) => void;
export type MutateMdastTreeFn = (tree: t.MdastRoot) => void;

export type MutateMdastVisitor = (fn: MutateMdastVisitorFn) => void;
export type MutateMdastVisitorFn = (e: MutateMdastVisitorArgs) => ContinuationResponse | any;
export type MutateMdastVisitorArgs = {
  node: t.MdastNode;
  index: number;
  parent: t.MdastNode | null;
  data<T extends O>(): T;
  hProperties<T extends O>(): T;
} & ContinuationDirectives;

/**
 * 💦
 * HTML
 */
export type MutateHast = {
  /**
   * Basic reveal of the root tree.
   *    Use this with standard unified.js tools
   *    (like 'unist-util-visit') like you would within a plugin.
   */
  tree: MutateHastTree;

  /**
   * Helper for running a 'unist-util-visit' across the HTML tree
   * with a set of helper tools passed in as arguments.
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
} & ContinuationDirectives;
