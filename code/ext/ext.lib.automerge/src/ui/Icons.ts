import { MdAdd, MdRefresh } from 'react-icons/md';
import { TbDatabase } from 'react-icons/tb';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  Add: icon(MdAdd),
  Databse: icon(TbDatabase),
} as const;
