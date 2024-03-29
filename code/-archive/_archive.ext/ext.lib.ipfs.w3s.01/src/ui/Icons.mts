import { MdArrowDownward, MdEdit, MdVerifiedUser } from 'react-icons/md';
import { Icon } from 'sys.ui.react.common';

const icon = Icon.renderer;

/**
 * Icon collection.
 */
export const Icons = {
  Edit: icon(MdEdit),
  Verified: icon(MdVerifiedUser),
  Arrow: { Down: icon(MdArrowDownward) },
} as const;
