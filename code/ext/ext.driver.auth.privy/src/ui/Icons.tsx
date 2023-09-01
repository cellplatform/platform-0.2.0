import { MdCall, MdClose, MdWallet } from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Phone: icon(MdCall),
  Wallet: icon(MdWallet),
  Close: icon(MdClose),
} as const;
