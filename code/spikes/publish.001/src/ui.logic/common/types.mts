/**
 * @external
 */
export type { Observable } from 'rxjs';

/**
 * @system
 */
export type { EventBus, Event, Disposable } from 'sys.types';
export type {
  AstNode,
  MdastNode,
  MdastRoot,
  MdastHeading,
  MdastCode,
  MdastText,
  MdastList,
  MdastListItem,
  MdastParagraph,
  MdastLink,
} from 'sys.text/src/types.mjs';
export type { Text, MarkdownProcessor } from 'sys.text/src/types.mjs';

/**
 * @local
 */
export * from '../../types.mjs';
