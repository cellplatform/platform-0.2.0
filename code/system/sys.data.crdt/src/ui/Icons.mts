import { MdSettingsInputAntenna, MdSensors, MdSensorsOff } from 'react-icons/md';
import { GoRepo, GoGitCommit } from 'react-icons/go';
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
};
