import { type t } from '../common';

import { Util } from '../u';
import { Overlay } from './Overlay';

export type DropOverlayProps = {
  settings?: t.ImageDropSettings;
  style?: t.CssValue;
};

export const DropOverlay: React.FC<DropOverlayProps> = (props) => {
  const blur = Util.dropOverBlur(props.settings);
  const message = Util.dropOverContent(props.settings);
  return <Overlay blur={blur} message={message} />;
};
