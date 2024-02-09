import { LuShare } from 'react-icons/lu';
import { MdAdd, MdClose, MdDone, MdRefresh, MdSettingsInputAntenna } from 'react-icons/md';
import { TbDatabase } from 'react-icons/tb';
import { VscRepo, VscSymbolClass } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Close: icon(MdClose),
  Done: icon(MdDone),
  Refresh: icon(MdRefresh),
  Add: icon(MdAdd),
  Database: icon(TbDatabase),
  Repo: icon(VscRepo),
  Share: icon(LuShare),
  Antenna: icon(MdSettingsInputAntenna),
  Object: icon(VscSymbolClass),
} as const;
