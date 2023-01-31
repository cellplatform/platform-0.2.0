import { MdCheck, MdClose, MdDoNotDisturb, MdPlayArrow, MdToggleOff } from 'react-icons/md';
import { VscSymbolVariable } from 'react-icons/vsc';

import { Icon } from '../ui/Icon';
export { Icon };

const icon = Icon.renderer;

/**
 * DevTools icons.
 */
export const Icons = {
  Method: icon(VscSymbolVariable),
  Close: icon(MdClose),
  Tick: icon(MdCheck),
  Skip: icon(MdToggleOff),
  Play: icon(MdPlayArrow),
};
