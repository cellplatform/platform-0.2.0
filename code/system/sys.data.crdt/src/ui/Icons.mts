import { GoGitCommit } from 'react-icons/go';
import { LuDownload, LuEdit2 } from 'react-icons/lu';
import {
  MdDataObject,
  MdDoneAll,
  MdInfoOutline,
  MdPlayArrow,
  MdReplay,
  MdSettingsInputAntenna,
  MdToggleOn,
  MdWarning,
} from 'react-icons/md';
import { VscDebugDisconnect, VscRepo, VscSymbolClass } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Info: icon(MdInfoOutline),
  Repo: icon(VscRepo),
  Editing: icon(LuEdit2),
  Commit: icon(GoGitCommit),
  Download: {
    ArrowTray: icon(LuDownload),
  },
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
} as const;
