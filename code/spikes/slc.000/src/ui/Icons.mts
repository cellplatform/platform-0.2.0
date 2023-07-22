import {
  MdInfoOutline,
  MdPause,
  MdPauseCircle,
  MdPlayArrow,
  MdPlayCircle,
  MdReplay,
} from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Info: icon(MdInfoOutline),
  Play: { Sharp: icon(MdPlayArrow), Circle: icon(MdPlayCircle) },
  Pause: { Sharp: icon(MdPause), Circle: icon(MdPauseCircle) },
  Replay: icon(MdReplay),
};
