import { GoRepo, GoGitCommit } from 'react-icons/go';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Repo: icon(GoRepo),
  Commit: icon(GoGitCommit),
};
