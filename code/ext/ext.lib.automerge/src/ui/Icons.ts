import { LuShare } from 'react-icons/lu';
import { MdAdd, MdRefresh } from 'react-icons/md';
import { TbDatabase } from 'react-icons/tb';
import { VscRepo } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  Add: icon(MdAdd),
  Database: icon(TbDatabase),
  Repo: icon(VscRepo),
  Share: icon(LuShare),
} as const;
