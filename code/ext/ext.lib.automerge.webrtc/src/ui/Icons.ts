import {
  MdArrowUpward,
  MdClose,
  MdDataObject,
  MdRefresh,
  MdSettingsInputAntenna,
} from 'react-icons/md';
import { TbDatabase } from 'react-icons/tb';
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
  Object: icon(MdDataObject),
} as const;
