import {
  MdClose,
  MdConnectedTv,
  MdDelete,
  MdDone,
  MdDoneOutline,
  MdMic,
  MdMicOff,
  MdOutlineViewInAr,
  MdSupportAgent,
  MdKeyboard,
  MdCamera,
  MdLanguage,
  MdVpnLock,
  MdStart,
  MdMultipleStop,
  MdPublicOff,
  MdPublic,
  MdWifiTethering,
  MdWifiTetheringOff,
  MdError,
  MdSettingsInputAntenna,
} from 'react-icons/md';
import { VscGithubAction } from 'react-icons/vsc';
import { FaNetworkWired } from 'react-icons/fa';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Close: icon(MdClose),
  Delete: { Bin: icon(MdDelete) },
  Cube: icon(MdOutlineViewInAr),
  Face: { Caller: icon(MdSupportAgent) },
  Screenshare: icon(MdConnectedTv),
  Mic: { On: icon(MdMic), Off: icon(MdMicOff) },
  Camera: { On: icon(MdCamera) },
  Done: { Outline: icon(MdDoneOutline), Solid: icon(MdDone) },
  Note: { Event: icon(VscGithubAction) },
  Keyboard: icon(MdKeyboard),
  Globe: {
    Language: icon(MdLanguage),
    On: icon(MdPublic),
    Off: icon(MdPublicOff),
    Lock: icon(MdVpnLock),
  },
  Connection: { On: icon(MdWifiTethering), Off: icon(MdWifiTetheringOff) },
  Arrow: { Start: icon(MdStart), TwoWay: icon(MdMultipleStop) },
  Error: icon(MdError),
  Network: {
    Antenna: icon(MdSettingsInputAntenna),
    Docs: icon(FaNetworkWired),
  },
};
