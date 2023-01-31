import { MdCheck, MdClose, MdPlayArrow, MdToggleOff } from 'react-icons/md';
import { VscSymbolVariable } from 'react-icons/vsc';
import { TbPrompt } from 'react-icons/tb';
import { HiCommandLine } from 'react-icons/hi2';
import { BiCommand } from 'react-icons/bi';

import { Icon } from '../ui/Icon';
export { Icon };

const icon = Icon.renderer;

/**
 * DevTools icons.
 */
export const DevIcons = {
  Method: icon(VscSymbolVariable),
  Close: icon(MdClose),
  Tick: icon(MdCheck),
  Skip: icon(MdToggleOff),
  Play: icon(MdPlayArrow),
  CmdPrompt: icon(TbPrompt),
  Command: icon(HiCommandLine),
  CommandKey: icon(BiCommand),
};
