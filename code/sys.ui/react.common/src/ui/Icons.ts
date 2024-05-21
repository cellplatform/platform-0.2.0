import { Icon } from './Icon';

import { BsKeyboard, BsKeyboardFill } from 'react-icons/bs';
import { GoTriangleRight } from 'react-icons/go';
import {
  MdClose,
  MdFace,
  MdOutlineVerticalAlignCenter,
  MdPortableWifiOff,
  MdVisibility,
  MdVisibilityOff,
  MdWifi,
} from 'react-icons/md';
import { RxOpenInNewWindow } from 'react-icons/rx';
import { TbCopy } from 'react-icons/tb';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Close: icon(MdClose),
  Wifi: { On: icon(MdWifi), Off: icon(MdPortableWifiOff) },
  Face: icon(MdFace),
  Copy: icon(TbCopy),
  Visibility: { On: icon(MdVisibility), Off: icon(MdVisibilityOff) },
  Keyboard: { fill: icon(BsKeyboardFill), outline: icon(BsKeyboard) },
  Align: { Center: icon(MdOutlineVerticalAlignCenter) },
  NewTab: icon(RxOpenInNewWindow),
  Triangle: { Right: icon(GoTriangleRight) },
} as const;
