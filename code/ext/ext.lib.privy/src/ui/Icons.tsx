import { MdAdd, MdClose, MdRefresh, MdWallet } from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Wallet: icon(MdWallet),
  Close: icon(MdClose),
  Refresh: icon(MdRefresh),
  Add: icon(MdAdd),
} as const;
