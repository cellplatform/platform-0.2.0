import { MdClose, MdRefresh, MdSettingsInputAntenna } from 'react-icons/md';
import { TbDatabase } from 'react-icons/tb';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Close: icon(MdClose),
  Refresh: icon(MdRefresh),
  Database: icon(TbDatabase),
  Antenna: icon(MdSettingsInputAntenna),
} as const;
