import { MdRefresh } from 'react-icons/md';
import { TbDatabase } from 'react-icons/tb';
import { VscRepo } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  Database: icon(TbDatabase),
  Repo: icon(VscRepo),
} as const;
