import { MdFace, MdPortableWifiOff, MdVisibility, MdVisibilityOff, MdWifi } from 'react-icons/md';
import { RiFileCopyFill } from 'react-icons/ri';

import { Icon } from './Icon';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Wifi: { On: icon(MdWifi), Off: icon(MdPortableWifiOff) },
  Face: icon(MdFace),
  Copy: icon(RiFileCopyFill),
  Visibility: { On: icon(MdVisibility), Off: icon(MdVisibilityOff) },
};
