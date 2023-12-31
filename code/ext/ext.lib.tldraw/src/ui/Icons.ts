import { MdRefresh } from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';
import { LuExternalLink } from 'react-icons/lu';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Refresh: icon(MdRefresh),
  ExternalLink: icon(LuExternalLink),
} as const;
