import {
  MdArrowBack,
  MdArrowDownward,
  MdArrowUpward,
  MdInfoOutline,
  MdPause,
  MdPauseCircle,
  MdPlayArrow,
  MdArrowForward,
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
  Arrow: {
    Left: icon(MdArrowBack),
    Right: icon(MdArrowForward),
    Up: icon(MdArrowUpward),
    Down: icon(MdArrowDownward),
  },
} as const;
