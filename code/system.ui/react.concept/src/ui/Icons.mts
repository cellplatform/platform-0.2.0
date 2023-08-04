import { FiDownload, FiDownloadCloud } from 'react-icons/fi';
import {
  MdArrowBack,
  MdArrowDownward,
  MdArrowForward,
  MdArrowUpward,
  MdInfoOutline,
  MdOutlineDownloadForOffline,
  MdPause,
  MdPlayArrow,
  MdReplay,
  MdOutlineVerticalAlignCenter,
} from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Info: icon(MdInfoOutline),
  Play: icon(MdPlayArrow),
  Pause: icon(MdPause),
  Replay: icon(MdReplay),
  Arrow: {
    Left: icon(MdArrowBack),
    Right: icon(MdArrowForward),
    Up: icon(MdArrowUpward),
    Down: icon(MdArrowDownward),
  },
  Download: {
    Circle: icon(MdOutlineDownloadForOffline),
    Cloud: icon(FiDownloadCloud),
    Tray: icon(FiDownload),
  },
  Align: { Center: icon(MdOutlineVerticalAlignCenter) },
} as const;
