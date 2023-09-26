/**
 * 💦💦
 *  @external Unified.js (ASTs)
 * 💦
 */
export type { Node as AstNode, Position as AstPosition } from 'unist';

/**
 * MDAST (Markdown)
 */
import type {
  Root as MdastRoot,
  Code as MdastCode,
  Heading as MdastHeading,
  Text as MdastText,
  List as MdastList,
  ListItem as MdastListItem,
  Paragraph as MdastParagraph,
  Link as MdastLink,
  Image as MdastImage,
  Content as MdastContent,
  Blockquote as MdastBlockquote,
  ThematicBreak as MdastThematicBreak,
  Table as MdastTable,
} from 'mdast';

export type {
  MdastRoot,
  MdastCode,
  MdastHeading,
  MdastText,
  MdastList,
  MdastListItem,
  MdastParagraph,
  MdastLink,
  MdastImage,
  MdastContent,
  MdastBlockquote,
  MdastThematicBreak,
  MdastTable,
};
export type MdastNode =
  | MdastRoot
  | MdastCode
  | MdastHeading
  | MdastText
  | MdastList
  | MdastListItem
  | MdastParagraph
  | MdastLink
  | MdastImage
  | MdastContent
  | MdastBlockquote
  | MdastTable;

/**
 * HAST (HTML)
 */
import type {
  Root as HastRoot,
  Element as HastElement,
  Text as HastText,
  Comment as HastComment,
  Doctype as HastDoctype,
} from 'hast';
import type { Raw as HastRaw } from 'mdast-util-to-hast';

export type { HastRoot, HastElement, HastText, HastComment, HastDoctype, HastRaw };
export type HastNode = HastRoot | HastElement | HastText | HastComment | HastDoctype | HastRaw;
