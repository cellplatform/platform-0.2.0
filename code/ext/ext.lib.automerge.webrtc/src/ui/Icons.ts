import { MdArrowUpward, MdClose, MdRefresh, MdSend, MdSettingsInputAntenna } from 'react-icons/md';
import { TbDatabase } from 'react-icons/tb';
import { VscSymbolClass } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Arrow: { Up: icon(MdArrowUpward) },
  Close: icon(MdClose),
  Refresh: icon(MdRefresh),
  Database: icon(TbDatabase),
  Antenna: icon(MdSettingsInputAntenna),
  Object: icon(VscSymbolClass),
  Send: icon(MdSend),
} as const;
