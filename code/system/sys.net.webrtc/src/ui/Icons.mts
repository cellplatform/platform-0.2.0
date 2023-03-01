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
} from 'react-icons/md';
import { VscGithubAction } from 'react-icons/vsc';
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
  Done: { Outline: icon(MdDoneOutline), Solid: icon(MdDone) },
  Note: { Event: icon(VscGithubAction) },
};
