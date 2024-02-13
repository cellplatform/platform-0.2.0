import { Icon } from './Icon';

import { BsKeyboard, BsKeyboardFill } from 'react-icons/bs';
import {
  MdFace,
  MdOpenInNew,
  MdOutlineVerticalAlignCenter,
  MdPortableWifiOff,
  MdVisibility,
  MdVisibilityOff,
  MdWifi,
} from 'react-icons/md';
import { TbCopy } from 'react-icons/tb';
import { VscRepo, VscSymbolClass } from 'react-icons/vsc';
import { RxOpenInNewWindow } from 'react-icons/rx';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Wifi: { On: icon(MdWifi), Off: icon(MdPortableWifiOff) },
  Face: icon(MdFace),
  Copy: icon(TbCopy),
  Visibility: { On: icon(MdVisibility), Off: icon(MdVisibilityOff) },
  Keyboard: { fill: icon(BsKeyboardFill), outline: icon(BsKeyboard) },
  Repo: icon(VscRepo),
  ObjectTree: icon(VscSymbolClass),
  Align: { Center: icon(MdOutlineVerticalAlignCenter) },
  NewTab: icon(RxOpenInNewWindow),
} as const;
