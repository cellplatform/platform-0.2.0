export * from './Text/types.mjs';
export * from './Text.Processor/types.mjs';
export * from './Markdown.Processor/types.mjs';

/**
 * 💦💦
 *  @external Unified.js (ASTs)
 * 💦
 */
export type { Node as AstNode } from 'unist';
export type { Root as HastRoot, Element as HastElement, Text as HastText } from 'hast';

import type {
  Root as MdastRoot,
  Code as MdastCode,
  Heading as MdastHeading,
  Text as MdastText,
  List as MdastList,
  ListItem as MdastListItem,
  Paragraph as MdastParagraph,
  Link as MdastLink,
} from 'mdast';

export {
  MdastRoot,
  MdastCode,
  MdastHeading,
  MdastText,
  MdastList,
  MdastListItem,
  MdastParagraph,
  MdastLink,
};

export type MdastNode =
  | MdastRoot
  | MdastCode
  | MdastHeading
  | MdastText
  | MdastList
  | MdastListItem
  | MdastParagraph
  | MdastLink;
