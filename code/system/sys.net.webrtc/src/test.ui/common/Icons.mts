import { icons } from 'react-icons';
import { MdPortableWifiOff, MdWifi, MdOutlineViewInAr, MdSupportAgent } from 'react-icons/md';

import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Cube: icon(MdOutlineViewInAr),
  Face: { Call: icon(MdSupportAgent) },
};
