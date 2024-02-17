import { MdCheck, MdRefresh, MdSend } from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  Check: icon(MdCheck),
  Send: icon(MdSend),
} as const;
