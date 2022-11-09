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
  MdastImage,
  MdastContent,
  MdastBlockquote,
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
  | MdastBlockquote;

/**
 * HAST (HTML)
 */
import type {
  Root as HastRoot,
  Element as HastElement,
  Text as HastText,
  Comment as HastComment,
  DocType as HastDocType,
} from 'hast';
import type { Raw as HastRaw } from 'mdast-util-to-hast';

export { HastRoot, HastElement, HastText, HastComment, HastDocType, HastRaw };
export type HastNode = HastRoot | HastElement | HastText | HastComment | HastDocType | HastRaw;
