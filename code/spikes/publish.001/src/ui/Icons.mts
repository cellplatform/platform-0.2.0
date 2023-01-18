import {
  MdArrowBack,
  MdArrowForward,
  MdAutoStories,
  MdClose,
  MdFace,
  MdFactCheck,
  MdOpenInFull,
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
};
