import { MdRefresh, MdVpnKey, MdVpnKeyOff } from 'react-icons/md';
import { TbNetwork } from 'react-icons/tb';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  Server: icon(TbNetwork),
  Key: { On: icon(MdVpnKey), Off: icon(MdVpnKeyOff) },
} as const;
