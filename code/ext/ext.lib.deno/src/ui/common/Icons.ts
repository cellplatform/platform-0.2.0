import { CgServer } from 'react-icons/cg';
import { MdRefresh } from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  Server: icon(CgServer),
} as const;
