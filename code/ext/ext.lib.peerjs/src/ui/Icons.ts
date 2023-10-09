import { MdContentCopy, MdEmojiPeople, MdRefresh, MdAdd, MdDone } from 'react-icons/md';
import { VscSymbolClass } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  Copy: icon(MdContentCopy),
  Person: icon(MdEmojiPeople),
  ObjectTree: icon(VscSymbolClass),
  Add: icon(MdAdd),
  Done: icon(MdDone),
} as const;
