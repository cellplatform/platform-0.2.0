import {
  MdAdd,
  MdClose,
  MdLogout,
  MdRefresh,
  MdVpnKey,
  MdVpnKeyOff,
  MdWallet,
} from 'react-icons/md';
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
  Logout: icon(MdLogout),
  Key: { On: icon(MdVpnKey), Off: icon(MdVpnKeyOff) },
} as const;
