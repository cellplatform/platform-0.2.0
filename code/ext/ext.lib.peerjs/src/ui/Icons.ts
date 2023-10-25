import {
  MdAdd,
  MdClose,
  MdContentCopy,
  MdDone,
  MdEmojiPeople,
  MdErrorOutline,
  MdRefresh,
  MdWarning,
} from 'react-icons/md';
import { VscSymbolClass } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Close: icon(MdClose),
  Refresh: icon(MdRefresh),
  Copy: icon(MdContentCopy),
  Person: icon(MdEmojiPeople),
  ObjectTree: icon(VscSymbolClass),
  Add: icon(MdAdd),
  Done: icon(MdDone),
  Error: icon(MdErrorOutline),
  Warning: icon(MdWarning),
} as const;
