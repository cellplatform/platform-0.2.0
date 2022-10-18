/**
 * @external
 */
import type { stringify, parse } from 'yaml';
export type Yaml = {
  stringify: typeof stringify;
  parse: typeof parse;
};

export type { Node as AstNode } from 'unist';
export type { Root as MdastRoot, Code as MdastCode } from 'mdast';
export type { Root as HastRoot, Element as HastElement, Text as HastText } from 'hast';

/**
 * @system
 */
export type { Fs } from 'sys.fs/src/types.mjs';

/**
 * @local
 */
export * from '../types.mjs';
