import {
  MdDelete,
  MdClose,
  MdOutlineViewInAr,
  MdSupportAgent,
  MdConnectedTv,
  MdMic,
  MdMicOff,
} from 'react-icons/md';
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
};
