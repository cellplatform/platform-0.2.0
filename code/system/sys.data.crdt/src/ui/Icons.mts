import { GoGitCommit, GoRepo } from 'react-icons/go';
import { MdDoneAll, MdSettingsInputAntenna, MdToggleOn, MdWarning } from 'react-icons/md';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Repo: icon(GoRepo),
  Commit: icon(GoGitCommit),
  Network: {
    Antenna: icon(MdSettingsInputAntenna),
    Disconnect: icon(VscDebugDisconnect),
  },
  Test: {
    Passed: icon(MdDoneAll),
    Failed: icon(MdWarning),
    Skipped: icon(MdToggleOn),
  },
};
