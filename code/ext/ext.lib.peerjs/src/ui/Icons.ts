import { MdContentCopy, MdEmojiPeople, MdRefresh } from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  Copy: icon(MdContentCopy),
  Person: icon(MdEmojiPeople),
} as const;
