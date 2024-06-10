import { MdRefresh } from 'react-icons/md';
import { SiFarcaster } from 'react-icons/si';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  Farcaster: icon(SiFarcaster),
} as const;
