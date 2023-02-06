import { MdClose, MdOutlineViewInAr, MdSupportAgent } from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Close: icon(MdClose),
  Cube: icon(MdOutlineViewInAr),
  Face: { Caller: icon(MdSupportAgent) },
};
