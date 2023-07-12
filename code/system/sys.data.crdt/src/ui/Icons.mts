import { GoGitCommit } from 'react-icons/go';
import {
  MdDoneAll,
  MdInfoOutline,
  MdPlayArrow,
  MdReplay,
  MdSettingsInputAntenna,
  MdToggleOn,
  MdWarning,
  MdDataObject,
  MdDraw,
} from 'react-icons/md';
import { VscDebugDisconnect, VscRepo, VscSymbolClass } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';
import { AiOutlineEdit } from 'react-icons/ai';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Info: icon(MdInfoOutline),
  Repo: icon(VscRepo),
  // Editing: icon(MdDraw),
  Editing: icon(AiOutlineEdit),
  Commit: icon(GoGitCommit),
  Network: {
    Antenna: icon(MdSettingsInputAntenna),
    Disconnect: icon(VscDebugDisconnect),
  },
  Test: {
    Run: icon(MdPlayArrow),
    Rerun: icon(MdReplay),
    Passed: icon(MdDoneAll),
    Failed: icon(MdWarning),
    Skipped: icon(MdToggleOn),
  },
  ObjectTree: icon(VscSymbolClass),
  Json: icon(MdDataObject),
};
