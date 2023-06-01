import { BiCommand } from 'react-icons/bi';
import { HiCommandLine } from 'react-icons/hi2';
import {
  MdCheck,
  MdClose,
  MdDoneAll,
  MdInfoOutline,
  MdKeyboard,
  MdNotStarted,
  MdPlayArrow,
  MdPlayCircle,
  MdReplay,
  MdSlowMotionVideo,
  MdToggleOff,
  MdToggleOn,
  MdWarning,
  MdPlayCircleOutline,
} from 'react-icons/md';
import { TbPrompt } from 'react-icons/tb';
import { VscSymbolVariable } from 'react-icons/vsc';
import { Icon } from '../ui/Icon';

export { Icon };

const icon = Icon.renderer;

/**
 * DevTools icons.
 */
export const DevIcons = {
  Info: icon(MdInfoOutline),
  Method: icon(VscSymbolVariable),
  Close: icon(MdClose),
  Tick: icon(MdCheck),
  Skip: icon(MdToggleOff),
  Play: icon(MdPlayArrow),
  Run: {
    FullCircle: { Outline: icon(MdPlayCircleOutline), Solid: icon(MdPlayCircle) },
    HalfCircle: icon(MdSlowMotionVideo),
    NotStarted: icon(MdNotStarted),
  },
  CmdPrompt: icon(TbPrompt),
  Command: icon(HiCommandLine),
  CommandKey: icon(BiCommand),
  Keyboard: icon(MdKeyboard),
  Test: {
    Run: icon(MdPlayArrow),
    Rerun: icon(MdReplay),
    Passed: icon(MdDoneAll),
    Failed: icon(MdWarning),
    Skipped: icon(MdToggleOn),
  },
};
