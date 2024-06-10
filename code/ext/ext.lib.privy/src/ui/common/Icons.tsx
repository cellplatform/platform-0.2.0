import {
  MdAdd,
  MdClose,
  MdLogout,
  MdRefresh,
  MdVpnKey,
  MdVpnKeyOff,
  MdWallet,
} from 'react-icons/md';
import { PiSignatureBold } from 'react-icons/pi';
import { SiFarcaster } from 'react-icons/si';
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
  Farcaster: icon(SiFarcaster),
  Signature: icon(PiSignatureBold),
} as const;
