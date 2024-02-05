import {
  MdArrowBack,
  MdArrowForward,
  MdAutoStories,
  MdClose,
  MdFace,
  MdFactCheck,
  MdOpenInFull,
  MdPlayCircle,
  MdPlayCircleOutline,
  MdReplay,
  MdSupport,
  MdVideoLibrary,
  MdVolumeOff,
} from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Play: { Filled: icon(MdPlayCircle), Outline: icon(MdPlayCircleOutline) },
  Close: icon(MdClose),
  Face: icon(MdFace),
  Book: icon(MdAutoStories),
  Expand: icon(MdOpenInFull),
  Support: icon(MdSupport),
  Muted: icon(MdVolumeOff),
  Replay: icon(MdReplay),
  Arrow: { Left: icon(MdArrowBack), Right: icon(MdArrowForward) },
  Complete: icon(MdFactCheck),
  Video: { Library: icon(MdVideoLibrary) },
} as const;
