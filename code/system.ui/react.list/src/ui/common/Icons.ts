import { BsKeyboard, BsKeyboardFill } from 'react-icons/bs';
import { MdFace, MdRefresh } from 'react-icons/md';
import { VscRepo, VscSymbolClass } from 'react-icons/vsc';

import { Icon } from 'sys.ui.react.common';
const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  Face: icon(MdFace),
  Repo: icon(VscRepo),
  ObjectTree: icon(VscSymbolClass),
  Keyboard: { Fill: icon(BsKeyboardFill), Outline: icon(BsKeyboard) },
} as const;
