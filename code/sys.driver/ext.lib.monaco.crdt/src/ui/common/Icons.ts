import { MdContentCopy, MdDone, MdRefresh, MdSync, MdSyncAlt } from 'react-icons/md';
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
  Copy: icon(MdContentCopy),
  Done: icon(MdDone),
  Sync: { Arrows: icon(MdSyncAlt), Circle: icon(MdSync) },
} as const;
