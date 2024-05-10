import { Icon } from 'sys.ui.react.common';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { MdPause, MdPlayArrow, MdPortableWifiOff, MdReplay, MdWifi } from 'react-icons/md';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Wifi: { On: icon(MdWifi), Off: icon(MdPortableWifiOff) },
  Mic: { On: icon(FiMic), Off: icon(FiMicOff) },
  Player: {
    Pause: icon(MdPause),
    PlayCircle: icon(MdPlayArrow),
    Replay: icon(MdReplay),
  },
} as const;
