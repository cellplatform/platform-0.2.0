import { MdPause, MdPlayArrow, MdReplay } from 'react-icons/md';
import { TbPhoto } from 'react-icons/tb';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Photo: icon(TbPhoto),
  Play: icon(MdPlayArrow),
  Pause: icon(MdPause),
  Replay: icon(MdReplay),
} as const;
