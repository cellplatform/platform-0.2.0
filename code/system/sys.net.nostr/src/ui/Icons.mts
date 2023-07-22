import { VscGithubAction } from 'react-icons/vsc';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Note: { Event: icon(VscGithubAction) },
} as const;
