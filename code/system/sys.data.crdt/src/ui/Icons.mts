import { GoGitCommit } from 'react-icons/go';
import {
  MdDoneAll,
  MdInfoOutline,
  MdPlayArrow,
  MdReplay,
  MdSettingsInputAntenna,
  MdToggleOn,
  MdWarning,
} from 'react-icons/md';
import { VscDebugDisconnect, VscRepo } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Info: icon(MdInfoOutline),
  Repo: icon(VscRepo),
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
};
